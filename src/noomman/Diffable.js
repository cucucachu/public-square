const database = require('./database');

/*
 * Class Diffable
 * This abstract class contains all the methods necesary for producing diff objects for updating
 *    instances, audit trails, and two-way relationship consistency. It is made to be
 *    extended by the Instance class, and should not be used directly.
 */
class Diffable {

    /*
     * constructor()
     * Will throw an error, you should not instantiate this class directly.
     * Throws
     * - Error - Diffable is an abstract class and should not be directly instantiated.
     */
    constructor() {
        if (new.target === Diffable) {
            throw new Error('Diffable is an abstract class and should not be directly instantiated.');
        }
    }

    /*
     * diff() 
     * Produces a diff object following mongodb update operation object conventions. If no
     *    changes have been made to this Diffable since it's creation, then the diff will be empty.
     * Returns
     * - Object - An object which can be passed to a mongo update function to update 
     *    the document in the database to match this Diffable.
     */
    diff() {
        const changes = this.currentState.diff(this.previousState);
        
        if (this.classModel.auditable) {
            if (!changes.$set) {
                changes.$set = {};
            }
            changes.$set.revision = this.revision + 1;
        }

        return changes;
    }

    /*
     * diffWithSplit()
     * Similar to diff() method, however this method will split non-singular relationship changes
     *    across '$addToSet' and '$pull' operations, rather than using a single '$set' operation, so that
     *    noomman can evalute which instances need to be updated for two-way relationship consistency.
     * Returns
     * - Object - An object in the format of a mongo update operations object, accept that a non-singular 
     *    relationship property can appear in both $pull and $addToSet operations (which is normally not allowed).
     */
    diffWithSplit() {
        const changes = this.currentState.diffWithSplit(this.previousState);
        
        if (this.classModel.auditable) {
            if (!changes.$set) {
                changes.$set = {};
            }
            changes.$set.revision = this.revision + 1;
        }

        return changes;
    }

    /*
     * rollbackDiff() 
     * Produces a diff object following mongodb update operation object conventions, except that operations are 
     *    stripped of the preceding '$' character (i.e. '$set' becomes 'set'). The stripping of the '$' character
     *    is necessary, because rollback diffs are meant to be stored as part of audit entries, and mongo will not
     *    allow properties names to began with a '$' character. Unlike the diff() method, this method gathers the 
     *    changes which would revert an object back to its previous state. If changes have been made to this Diffable 
     *    since it's creation, then the diff will be empty.
     * Returns
     * - Object - A diff object in the format of a mongo update operation object, except that operations are 
     *    stripped of the preceding '$' character (i.e. '$set' becomes 'set').
     */
    rollbackDiff() {
        const changes = this.previousState.diff(this.currentState);
        if (changes.$set) {
            changes.set = changes.$set;
            delete changes.$set;
        }
        
        if (changes.$unset) {
            changes.unset = changes.$unset;
            delete changes.$unset;
        }
        
        if (changes.$addToSet) {
            changes.addToSet = changes.$addToSet;
            delete changes.$addToSet;

            for (const key in changes.addToSet) {
                if (changes.addToSet[key].$each) {
                    changes.addToSet[key].each = changes.addToSet[key].$each;
                    delete changes.addToSet[key].$each;
                }
            }
        }
        
        if (changes.$pull) {
            changes.pull = changes.$pull;
            delete changes.$pull;
            for (const key in changes.pull) {
                if (changes.pull[key].$in) {
                    changes.pull[key].in = changes.pull[key].$in;
                    delete changes.pull[key].$in;
                }
            }
        }

        return changes;
    }

    /* 
     * mirrorOperator()
     * Determines for a particular operator and relationship cardinallity, what the 
     *    reverse or mirror operation would be to keep the mirror relationship consistent.
     * Parameters
     * - operator - String - Expected to be '$set', '$unset', '$addToSet', or '$pull'.
     * - cardinality - Object - A cardinality object containing two properties, 'to' and 'from'. 
     *    Generated by calling ClassModel.cardinalityOfRelationship().
     * Returns
     * - String - A string value which is either '$addToSet' or '$pull'.
     */
    static mirrorOperator(operator, cardinality) {
        if (operator === '$set') {
            if (cardinality.from === '1') {
                return '$set';
            }
            return '$addToSet';
        }
        else if (operator === '$unset') {
            if (cardinality.from === '1') {
                return '$unset';
            }
            return '$pull';
        }
        else if (operator === '$addToSet') {
            if (cardinality.from === '1') {
                return '$set';
            }
            return '$addToSet';
        }
        else if (operator === '$pull') {
            if (cardinality.from === '1') {
                return '$unset';
            }
            return '$pull';
        }
    }

    /*
     * valueForOperator(diff, operator, relationshipName)
     * Retrieves the value of the relationship with given name in the given
     *    diff operator from the given diff. This is useful because a diff object
     *    '$addToSet' or '$pull' operator may have its value contained in a '$each' 
     *    or '$in' operator, and might be a single ObjectId or an array of ObjectIds.
     * Parameters
     * - diff - Object - A diff object generated by a diff() method.
     * - operator - String - Expected to be either '$addToSet' or '$pull'.
     * - relationshipName - String - The name of the relationship to get a value for.
     * Returns
     * - Array[ObjectId] - An array of ObjectId(s) which were part of the diff object for
     *    the given operator and relationshipName.
     */
    static valueForOperator(diff, operator, relationshipName) {
        let value = diff[operator][relationshipName];

        if (value === undefined) {
            return undefined;
        }
                        
        if (operator === '$addToSet' && value.$each !== undefined) {
            value = value.$each;
        }
        if (operator === '$pull' && value.$in !== undefined) {
            value = value.$in;
        }

        if (!Array.isArray(value)) {
            value = [value];
        }

        return value;
    };

    /*
     * relatedDiffs(diff)
     * Produces a diff-like object which represents all the changes necessary to related instances which have two-way 
     *    relationships with this instance that have been updated on this instance. The produced diff shows 
     *    for each two-way relationship what other instances need to be updated and what changes need to be applied to each.
     * Parameters
     * - diff - Object - A diff object from which to produce a relatedDiff object (should be produced by calling diffWithSplits()). 
     *    This is optional, and if no diff is given, the method diffWithSplits() will be called to generate a diff to work with. 
     * Returns
     * - Object - A relatedDiff object
     *    {
     *       relationship: {
     *          ObjectId: diffObject,
     *       },
     *    }
     */
    relatedDiffs(diff) {
        const relatedDiffObject = {};
        const twoWayRelationships = this.classModel.relationships.filter(relationship => relationship.mirrorRelationship !== undefined);

        if (twoWayRelationships.length !== 0) {
            diff = diff === undefined ? this.diffWithSplit() : diff;
            const operators = Object.keys(diff);

            for (const relationship of twoWayRelationships) {
                const cardinality = this.classModel.cardinalityOfRelationship(relationship.name);

                for (const operator of operators) {
                    const value = Diffable.valueForOperator(diff, operator, relationship.name);

                    if (value !== undefined) {
                        relatedDiffObject[relationship.name] = relatedDiffObject[relationship.name] !== undefined ? relatedDiffObject[relationship.name] : {};
                        let mirrorOperator = Diffable.mirrorOperator(operator, cardinality);

                        for (const relatedInstance of value) {
                            relatedDiffObject[relationship.name][relatedInstance.toString()] = {
                                [mirrorOperator]: {
                                    [relationship.mirrorRelationship]: this._id,
                                }
                            };
                        }
                    }
                }
            }
        }

        return relatedDiffObject;
    }

    /*
     * reducedRelatedDiffs(diff)
     * Transforms a relatedDiff object into a reducedRelatedDiff object, where diff objects for the same related instance
     *    are combined into a single diff object for each related Instance. This reducedRelatedDiff object can then be used
     *    to apply changes to instances that need to be updated to maintain two-way relationship consistency.
     * Parameters
     * diff - Object - A diff object generated by calling relatedDiffs(). If not provided, a diff will be generated by calling 
     *    relatedDiffs() on this Diffable.
     * Returns
     * - Object - A reducedRelatedDiff object
     *    {
     *       ObjectId: diffObject,
     *    }
     */
    reducedRelatedDiffs(diff) {
        const reduced = {};

        diff = diff === undefined ? this.relatedDiffs() : diff;

        for (const relationship of Object.keys(diff)) {
            for (const id of Object.keys(diff[relationship])) {
                if (reduced[id] === undefined) {
                    reduced[id] = {};
                }

                for (const operator of Object.keys(diff[relationship][id])) {
                    if (reduced[id][operator] === undefined) {
                        reduced[id][operator] = {};
                    }
                    
                    for (const mirrorRelationship of Object.keys(diff[relationship][id][operator])) {
                        reduced[id][operator][mirrorRelationship] = diff[relationship][id][operator][mirrorRelationship];
                    }
                }
            }
        }

        return reduced;
    }

    /*
     * combineMultipleRelatedDiffs(relatedDiffs) 
     * Combines mutiple relatedDiff objects into a single object, and transforms the result to combine
     *    all the operations for each related instance into a single diff object. This is similar to 
     *    reducedRelatedDiffs, except is meant to be used when gathering all the related instances
     *    that need to be updated due to changes to a set of instances.
     * Parameters
     * - Array<Object> - An Array of relatedDiff objects generated by calling relatedDiffs() on multiple
     *    Diffables.
     * Returns
     * - Object - a reducedRelatedDiff object
     *    {
     *       ObjectId: diffObject,
     *    }
     */
    static combineMultipleRelatedDiffs(relatedDiffs) {
        const combined = {};

        for (const reducedDiff of relatedDiffs) {
            for (const relationship of Object.keys(reducedDiff)) {
                for (const id of Object.keys(reducedDiff[relationship])) {
                    if (combined[id] === undefined) {
                        combined[id] = {};
                    }
    
                    for (const operator of Object.keys(reducedDiff[relationship][id])) {
                        if (combined[id][operator] === undefined) {
                            combined[id][operator] = {};
                        }
                        
                        for (const mirrorRelationship of Object.keys(reducedDiff[relationship][id][operator])) {
                            if (combined[id][operator][mirrorRelationship] === undefined) {
                                combined[id][operator][mirrorRelationship] = reducedDiff[relationship][id][operator][mirrorRelationship];
                            }
                            else {
                                if (operator === '$addToSet') {
                                    const currentValue = combined[id][operator][mirrorRelationship];
                                    if (combined[id][operator][mirrorRelationship].$each === undefined) {
                                        delete combined[id][operator][mirrorRelationship];
                                        combined[id][operator][mirrorRelationship] = {
                                            $each: [currentValue, reducedDiff[relationship][id][operator][mirrorRelationship]]
                                        }
                                    }
                                    else {
                                        combined[id][operator][mirrorRelationship].$each.push(reducedDiff[relationship][id][operator][mirrorRelationship]);
                                    }
                                }
                                if (operator === '$pull') {
                                    const currentValue = combined[id][operator][mirrorRelationship];
                                    if (combined[id][operator][mirrorRelationship].$in === undefined) {
                                        delete combined[id][operator][mirrorRelationship];
                                        combined[id][operator][mirrorRelationship] = {
                                            $in: [currentValue, reducedDiff[relationship][id][operator][mirrorRelationship]]
                                        }
                                    }
                                    else {
                                        combined[id][operator][mirrorRelationship].$in.push(reducedDiff[relationship][id][operator][mirrorRelationship]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return combined;
    }

    /*
     * combineSetOperations(diff)
     * Takes a diff object and combines any property change which appears in both '$addToSet' and '$pull' 
     *    operations into a single '$set' operation. This will take a diff object which is like that produced
     *    by calling diffWithSplits() and transform it into a diff which mongo can accept as an update object, 
     *    like that produced by diff().
     * Parameters
     * - diff - Object - A diff object in which to combine '$addToSet' and '$pull' operations.
     * Returns
     * - Object - A diff object the same as the given diff, but which '$addToSet' and '$pull' operations
     *    on the same property combined into a single '$set' operation.
     */
    combineSetOperations(diff) {
        const combined = {};

        // Combine any relationships in both $pull and $addToSet operators into a single $set operation
        if (diff.$addToSet && diff.$pull) {
            for (const addToSetProperty of Object.keys(diff.$addToSet)) {
                for (const pullProperty of Object.keys(diff.$pull)) {
                    if (addToSetProperty === pullProperty) {
                        const relationship = addToSetProperty;

                        let currentValue = this['_' + relationship];
                        if (!Array.isArray(currentValue)) {
                            currentValue = currentValue.getObjectIds();
                        }
                        currentValue = new Set(currentValue.map(id => id.toHexString()));

                        for (const pullValue of Diffable.valueForOperator(diff, '$pull', relationship)) {
                            currentValue.delete(pullValue.toHexString());
                        }

                        for (const addValue of Diffable.valueForOperator(diff, '$addToSet', relationship)) {
                            currentValue.add(addValue.toHexString());
                        }
                        if (combined.$set === undefined) {
                            combined.$set = {};
                        }

                        combined.$set[relationship] = [...currentValue].map(id => database.ObjectId(id));
                        delete diff.$addToSet[relationship];
                        delete diff.$pull[relationship];
                    }
                }
            }
        }

        // Copy over the rest of the operations and relationships.
        for (const operator of Object.keys(diff)) {
            if (combined[operator] === undefined) {
                combined[operator] = {};
            }
            for (const property of Object.keys(diff[operator])) {
                combined[operator][property] = diff[operator][property];
            }
        }

        // Remove $addToSet and $pull if they are empty.
        if (combined.$addToSet && Object.keys(combined.$addToSet).length === 0) {
            delete combined.$addToSet;
        }
        if (combined.$pull && Object.keys(combined.$pull).length === 0) {
            delete combined.$pull;
        }

        return combined;
    }

    /*
     * applyChanges(changes)
     * Takes a diff object and applies the changes within to this instance of Diffable.
     * Parameters
     * - changes - Object - A diff object produced by one of the diff methods.
     */
    applyChanges(changes) {
        changes = this.combineSetOperations(changes);
        this.validateChanges(changes);

        const attributeNames = this.classModel.attributes.map(attribute => attribute.name);
        const relationshipNames = this.classModel.relationships.map(relationship => relationship.name);

        if (changes.$set) {
            for (const key in changes.$set) {
                if (attributeNames.includes(key)) {
                    this[key] = changes.$set[key];
                }
                else if (relationshipNames.includes(key)) {
                    const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name === key)[0];
                    if (relationshipDefinition.singular) {
                        this.currentState.setSingularRelationshipToId(key, changes.$set[key]);
                    }
                    else {
                        this.currentState.setNonSingularRelationshipToIds(key, changes.$set[key]);
                    }   
                }
                else {
                    throw new Error('instance.applyChanges(): Attempt to set a value which is not an attribute or relationship. ' + key);
                }
            }
        }

        if (changes.$unset) {
            for (const key in changes.$unset) {
                if (attributeNames.includes(key) || relationshipNames.includes(key)){
                    this[key] = null;
                }
                else {
                    throw new Error('instance.applyChanges(): Attempt to unset a value which is not an attribute or relationship.');
                }
            }
        }

        if (changes.$addToSet) {
            for (const key in changes.$addToSet) {
                if (relationshipNames.includes(key)) {
                    const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name === key)[0];
                    if (!relationshipDefinition.singular) {
                        let idsSet = this['_' + key];
                        if (!Array.isArray(idsSet)) {
                            idsSet = idsSet.getObjectIds();
                        }
                        idsSet = new Set(idsSet);

                        if (changes.$addToSet[key].$each !== undefined) {
                            for (const item of changes.$addToSet[key].$each) {
                                idsSet.add(item);
                            }
                        }
                        else {
                            idsSet.add(changes.$addToSet[key]);
                        }

                        this.currentState.setNonSingularRelationshipToIds(key, [...idsSet]);
                    }
                    else {
                        throw new Error('instance.applyChanges(): Attempt to use $addToSet on a property which is not non-singular relationship.');
                    }
                }
                else {
                    throw new Error('instance.applyChanges(): Attempt to use $addToSet on a property which is not non-singular relationship.');
                }
            }
        }

        if (changes.$pull) {
            for (const key in changes.$pull) {
                if (relationshipNames.includes(key)) {
                    const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name === key)[0];
                    if (!relationshipDefinition.singular) {
                        let ids = this['_' + key];
                        if (!Array.isArray(ids)) {
                            ids = ids.getObjectIds();
                        }
                        let idsSet = new Set(ids);

                        if (changes.$pull[key].$in !== undefined) {
                            for (const item of changes.$pull[key].$in) {
                                for (const id of ids) {
                                    if (id.equals(item)) {
                                        idsSet.delete(id);
                                    }
                                }
                            }
                        }
                        else {
                            for (const id of ids) {
                                if (id.equals(changes.$pull[key])) {
                                    idsSet.delete(id);
                                }
                            }
                        }
                        this.currentState.setNonSingularRelationshipToIds(key, [...idsSet]);
                    }
                    else {
                        throw new Error('instance.applyChanges(): Attempt to use $pull on a property which is not non-singular relationship.');
                    }
                }
                else {
                    throw new Error('instance.applyChanges(): Attempt to use $pull on a property which is not non-singular relationship.');
                }
            }
        }
    }

    /* 
     * saveAuditEntry()
     * Saves an audit entry for this instance of Diffable. An audit entry is a diff which will return the instance
     *    to its previous state. It is produced by calling rollbackDiff().
     * Returns
     * - Promise<insertOneWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~insertOneWriteOpResult
     * Throws
     * - Error - If this instance has a ClassModel which is not auditable.
     * - Error - If this Diffable has no changes.
     * - Error - If this Diffable has not yet been saved to the database.
     */
    async saveAuditEntry() {
        if (this.classModel.auditable === false) 
            throw new Error('instance.saveAuditEntry() called on an Instance of a non-auditable ClassModel.');

        if (this.currentState.equals(this.previousState)) 
            throw new Error('instance.saveAuditEntry() called on an Instance with no changes.');
        
        if (this.saved() === false)
            throw new Error('instance.saveAuditEntry() called on an new Instance.');

        const auditEntry = {
            _id: database.ObjectId(),
            revision: this.revision,
            forInstance: this._id,
            changes: this.rollbackDiff(),
        }

        return database.insertOne('audit_' + this.classModel.collection, auditEntry);
    }

    /*
     * revertToRevision(revisionNumber)
     * Applies all the necessary changes to revert this Diffable back to the state it was in
     *    at the given revisionNumber. Only works for Diffables with auditable ClassModels. 
     *    Applies changes in place and does not save to the database.
     * Parameters
     * - revisionNumber - Number - The number of the revision to revert this Diffable to. 
     *    1 is considered the initial state of the instance.
     * Throws
     * - Error - If called on a Diffable with a ClassModel which is not auditable.
     */
    async revertToRevision(revisionNumber) {
        if (!this.classModel.auditable) {
            throw new Error('instance.revertToRevision() called on an instance of a non-auditable class model.');
        }

        if (this.revision <= 0 || typeof(revisionNumber) !== 'number' || revisionNumber >= this.revision) {
            return; 
        }

        const previousRevisions = await database.find('audit_' + this.classModel.collection, { forInstance: this._id });

        for (let i = this.revision - 1; i >= revisionNumber; i--) {
            const changes = Diffable.hydrateAuditEntry(previousRevisions.filter(revision => revision.revision === i)[0].changes);
            this.applyChanges(changes);
        }
    }

    /*
     * hydrateAuditEntry(changes)
     * Converts a diff object which has had its operators stripped of the '$' character back to a valid
     *    mongo update operation object (i.e. converts 'set' operators become '$set' operators, etc.).
     *    Used when retrieving an audit entry to convert its 'changes' property back into a working diff object.
     * Parameters(changes)
     * - changes - Object - A diff object, usually from an audit entry, or produced by rollbackDiff().
     * Returns
     * - Object - A valid diff object in the form of a mongo update operations object.
     */
    static hydrateAuditEntry(changes) {
        const hydrated = {};

        for (const operator of Object.keys(changes)) {
            hydrated['$' + operator] = changes[operator];

            if (operator === 'addToSet') {
                for (const property of Object.keys(changes[operator])) {
                    if (changes[operator][property].each !== undefined) {
                        hydrated['$' + operator][property].$each = hydrated['$' + operator][property].each;
                        delete hydrated['$' + operator][property].each;
                    }
                }
            }

            if (operator === 'pull') {
                for (const property of Object.keys(changes[operator])) {
                    if (changes[operator][property].in !== undefined) {
                        hydrated['$' + operator][property].$in = hydrated['$' + operator][property].in;
                        delete hydrated['$' + operator][property].in;
                    }
                }
            }
        }

        return hydrated;
    }

    /*
     * validateChanges(changes)
     * Will throw errors if the given changes object is not a valid diff object.
     * Parameters
     * - changes - Object - A diff object produced by one of the diff methods.
     * Throws
     * - Error - If the changes object contains invalid properties or is configured in an invalid way.
     */
    validateChanges(changes) {
        if (!changes || typeof(changes) !== 'object') {
            throw new Error('Changes must be an object.');
        }
        const operators = Object.keys(changes);
        const nonSingularRelationshipOperators = ['$addToSet', '$pull'];
        const attributeNames = this.classModel.attributes.map(attribute => attribute.name);
        const relationshipNames = this.classModel.relationships.map(relationship => relationship.name);
        const nonSingularRelationshipNames = this.classModel.relationships.filter(relationship => !relationship.singular).map(relationship => relationship.name);
        const propertiesSeen = [];

        for (const operator of operators) {
            if (!['$set', '$unset', '$addToSet', '$pull'].includes(operator)) {
                throw new Error('Invalid update operator: ' + operator + '.');
            }

            if (typeof(changes[operator]) !== 'object') {
                throw new Error('Operator set to something other than an object.');
            }

            const properties = Object.keys(changes[operator]);

            if (properties.length === 0) {
                throw new Error('Operator with empty object.');
            }

            for (const property of properties) {
                const isAttribute = attributeNames.includes(property);
                const isRelationship = relationshipNames.includes(property);
                const isNonSingularRelationship = nonSingularRelationshipNames.includes(property);

                if(propertiesSeen.includes(property)) {
                    throw new Error('Cannot perform multiple operations an the same attribute or relationship.');
                }
                propertiesSeen.push(property);

                if (!isAttribute && !isRelationship) {
                    throw new Error('Attempt to update a property which is not an attribute or relationship.');
                }

                if (nonSingularRelationshipOperators.includes(operator)) {
                    if (!isNonSingularRelationship) {
                        throw new Error('Attempt to use ' + nonSingularRelationshipOperators + ', on an attribute or singular relationship.');
                    }

                    if (Array.isArray(changes[operator][property])) {
                        if (operator === '$addToSet') {
                            throw new Error('Attempt to add an array using $addToSet without using \'$each\'.');
                        }
                        if (operator === '$pull') {
                            throw new Error('Attempt to remove an array using $pull without using \'$in\'.');
                        }
                    }

                    if (changes[operator][property].$each !== undefined) {
                        if (operator === '$pull') {
                            throw new Error('Attempt to use \'$each\' with a $pull operator. Use \'$in\' instead.');
                        }

                        if (!Array.isArray(changes[operator][property].$each)) {
                            throw new Error('Attempt to use $addToSet and $each without an Array value.');
                        }
                    }

                    if (changes[operator][property].$in) {
                        if (operator === '$addToSet') {
                            throw new Error('Attempt to use \'$in\' with a $addToSet operator. Use \'$each\' instead.');
                        }

                        if (!Array.isArray(changes[operator][property].$in)) {
                            throw new Error('Attempt to use $pull and $in without an Array value.');
                        }
                    }
                }
            }
        }


    }
}

module.exports = Diffable;
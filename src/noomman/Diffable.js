const database = require('./database');

class Diffable {
    constructor() {
        if (new.target === Diffable) {
            throw new Error('Diffable is an abstract class and should not be directly instantiated.');
        }
    }

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

    relatedDiffs() {

    }

    applyChanges(changes) {
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
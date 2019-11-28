/*
  Description: Defines an application class model.
*/

var db = require('./database');
const InstanceSet = require('./InstanceSet');
const Instance = require('./Instance');
const Attribute = require('./Attribute');
const Relationship = require('./Relationship');
const Diffable = require('./Diffable');
const SuperSet = require('./SuperSet');

const AllClassModels = [];

class ClassModel {

    constructor(schema) {

        this.constructorValidations(schema);

        this.className = schema.className;
        this.subClasses = [];
        this.abstract = schema.abstract;
        this.useSuperClassCollection = schema.useSuperClassCollection;
        this.superClasses = schema.superClasses ? schema.superClasses : [];
        this.indices = schema.indices ? schema.indices : [];
        this.collection = schema.useSuperClassCollection ? schema.superClasses[0].collection : schema.className.toLowerCase();
        this.auditable = schema.auditable === true;
        this.staticMethods = schema.staticMethods ? schema.staticMethods : {};
        this.nonStaticMethods = schema.nonStaticMethods ? schema.nonStaticMethods : {};

        if (this.superClasses.length === 0 && this.className !== 'NoommanClassModel') {
            this.superClasses.push(NoommanClassModel);
        }

        if (!schema.useSuperClassCollection) {
            const lastLetter = schema.className.substr(-1).toLowerCase();
            this.collection = schema.className.toLowerCase();
            if (lastLetter === 's') {
                this.collection = this.collection + 'e';
            }
            this.collection = this.collection + 's';
        }
        
        this.attributes = [];
        this.relationships = [];

        if (schema.attributes) {
            for (const attribute of schema.attributes) {
                this.attributes.push(new Attribute(attribute));
            }
        }

        if (schema.relationships) {
            for (const relationship of schema.relationships) {
                this.relationships.push(new Relationship(relationship));
            }
        }

        this.createControlMethods = [];
        this.readControlMethods = [];
        this.updateControlMethods = [];
        this.deleteControlMethods = [];
        this.sensitiveControlMethods = [];

        if (schema.crudControls) {
            if (schema.crudControls.createControl) {
                this.createControlMethods.push(schema.crudControls.createControl);
            }
            if (schema.crudControls.readControl) {
                this.readControlMethods.push(schema.crudControls.readControl);
            }
            if (schema.crudControls.updateControl) {
                this.updateControlMethods.push(schema.crudControls.updateControl);
            }
            if (schema.crudControls.deleteControl) {
                this.deleteControlMethods.push(schema.crudControls.deleteControl);
            }
            if (schema.crudControls.sensitiveControl) {
                this.sensitiveControlMethods.push(schema.crudControls.sensitiveControl);
            }
        }

        this.validations = [];

        if (schema.validations) {
            for (const validation of schema.validations) {
                this.validations.push(validation);
            }
        }

        if (schema.superClasses) {
            for (const superClass of schema.superClasses) {
                this.attributes = this.attributes.concat(superClass.attributes);
                this.relationships = this.relationships.concat(superClass.relationships);
                this.indices = this.indices.concat(superClass.indices);
                this.createControlMethods = this.createControlMethods.concat(superClass.createControlMethods);
                this.readControlMethods = this.readControlMethods.concat(superClass.readControlMethods);
                this.updateControlMethods = this.updateControlMethods.concat(superClass.updateControlMethods);
                this.deleteControlMethods = this.deleteControlMethods.concat(superClass.deleteControlMethods);
                this.sensitiveControlMethods = this.sensitiveControlMethods.concat(superClass.sensitiveControlMethods);
                this.validations = this.validations.concat(superClass.validations);
                this.auditable = superClass.auditable ? true : this.auditable;
                this.inheritStaticMethods(superClass);
                this.inheritNonStaticMethods(superClass);
                superClass.subClasses.push(this);
            }
        }

        for (const staticMethod of Object.keys(this.staticMethods)) {
            this[staticMethod] = this.staticMethods[staticMethod];
        }

        for (const nonStaticMethod of Object.keys(this.nonStaticMethods)) {
            this[nonStaticMethod] = this.nonStaticMethods[nonStaticMethod];
        }

        AllClassModels[this.className] = this;
    }

    constructorValidations(schema) {
        
        if (!schema.className)
            throw new Error('className is required.');

        if (schema.attributes && !Array.isArray(schema.attributes))
            throw new Error('If attributes is set, it must be an Array.');

        if (schema.relationships && !Array.isArray(schema.relationships))
            throw new Error('If relationships is set, it must be an Array.');

        if (schema.superClasses && !Array.isArray(schema.superClasses))
            throw new Error('If superClasses is set, it must be an Array.');

        if (schema.superClasses && schema.superClasses.length == 0)
            throw new Error('If superClasses is set, it cannot be an empty Array.');

        if (schema.useSuperClassCollection && (!schema.superClasses || schema.superClasses.length !== 1)) {
            throw new Error('If useSuperClassCollection is true, a single super class must be provided.');
        }

        if (schema.auditable !== undefined && typeof(schema.auditable) !== 'boolean') {
            throw new Error('If auditable is provided, it must be a boolean.');
        }

        if (schema.indices !== undefined && !Array.isArray(schema.indices)) {
            throw new Error('If indices are provided, indices must be an array.');
        }

        if (schema.useSuperClassCollection && schema.abstract) {
            throw new Error('If useSuperClassCollection is true, abstract cannot be true.')
        }

        if (schema.crudControls) {
            if (schema.crudControls.readControl && typeof(schema.crudControls.readControl) !== 'function') {
                throw new Error('If a readControl method is provided, it must be a function.');
            }
            if (schema.crudControls.createControl && typeof(schema.crudControls.createControl) !== 'function') {
                throw new Error('If a createControl method is provided, it must be a function.');
            }
            if (schema.crudControls.updateControl && typeof(schema.crudControls.updateControl) !== 'function') {
                throw new Error('If a updateControl method is provided, it must be a function.');
            }
            if (schema.crudControls.deleteControl && typeof(schema.crudControls.deleteControl) !== 'function') {
                throw new Error('If a deleteControl method is provided, it must be a function.');
            }
            if (schema.crudControls.sensitiveControl && typeof(schema.crudControls.sensitiveControl) !== 'function') {
                throw new Error('If a sensitiveControl method is provided, it must be a function.');
            }
        }

        if (schema.attributes) {
            let sensitiveAttributes = false;
            for (const attribute of schema.attributes) {
                if (attribute.sensitive === true) {
                    sensitiveAttributes = true;
                    break;
                }
            }

            if (sensitiveAttributes) {
                if (!schema.crudControls || !schema.crudControls.sensitiveControl) {
                    throw new Error('At least one attribute is marked sensitive, but no sensitiveControl method is provided.');
                }
            }
            else {
                if (schema.crudControls && schema.crudControls.sensitiveControl) {
                    throw new Error('A sensitiveControl method was provided, but no attributes are marked sensitive.');
                }
            }
        }
        else {
            if (schema.crudControls && schema.crudControls.sensitiveControl) {
                throw new Error('A sensitiveControl method was provided, but no attributes are marked sensitive.');
            }
        }

        if (schema.staticMethods !== undefined) {
            if (typeof(schema.staticMethods) !== 'object') {
                throw new Error('If staticMethods is provided, it must be an object.');
            }

            for (const staticMethod in schema.staticMethods) {
                if (typeof(schema.staticMethods[staticMethod]) !== 'function') {
                    throw new Error('Each property of staticMethods object must be a function.');
                }

                if (Object.getOwnPropertyNames(ClassModel.prototype).includes(staticMethod)) {
                    throw new Error('Attempt to add a static method with the same name as a built in Noomman method: ' + staticMethod + '.');
                }
            }
        }

        if (schema.nonStaticMethods !== undefined) {
            if (typeof(schema.nonStaticMethods) !== 'object') {
                throw new Error('If nonStaticMethods is provided, it must be an object.');
            }

            for (const nonStaticMethod in schema.nonStaticMethods) {
                if (typeof(schema.nonStaticMethods[nonStaticMethod]) !== 'function') {
                    throw new Error('Each property of nonStaticMethods object must be a function.');
                }

                if (Object.getOwnPropertyNames(Instance.prototype).includes(nonStaticMethod)) {
                    throw new Error('Attempt to add a non-static method with the same name as a built in Noomman method: ' + nonStaticMethod + '.');
                }
            }
        }

        if (schema.superClasses) {
            for (const superClass of schema.superClasses) {

                for (const attribute of superClass.attributes) {
                    if (schema.attributes && schema.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Sub class schema cannot contain the same attribute names as a super class schema.');
                    }
                }
                for (const relationship of superClass.relationships) {
                    if (schema.relationships && schema.relationships.map(relationship => relationship.name).includes(relationship.name)) {
                        throw new Error('Sub class schema cannot contain the same relationship names as a super class schema.');
                    }
                }

                if (superClass.useSuperClassCollection) {
                    throw new Error('You cannot create a sub class of a class which has useSuperClassCollection set to true.');
                }

                if (schema.auditable === false && superClass.auditable === true) {
                    throw new Error('You cannot create a non-auditable sub class of an auditable super class.');
                }
            }
        } 

        if (schema.useSuperClassCollection && schema.abstract) 
            throw new Error('If useSuperClassCollection is true, the class cannot be abstract.');

        if (schema.validations && !Array.isArray(schema.validations))
            throw new Error('If validations are provided, it must be an Array.');

    }

    async index() {
        const indicesApplied = [];

        for (const index of this.indices) {
            indicesApplied.push(await db.index(this.collection, index));
        }

        if (this.useSuperClassCollection) {
            indicesApplied.push(await db.index(this.collection, '__t'));
        }

        return indicesApplied;
    }

    validateRelationships() {
        for (const relationship of this.relationships) {
            const toClass = AllClassModels[relationship.toClass];
            if (toClass === undefined) {
                throw new Error(
                    'Relationship ' + this.className + '.' + relationship.name + 
                    ' is a reference to a Class Model that does not exist: ' + relationship.toClass + '.'
                );
            }

            if (relationship.mirrorRelationship !== undefined) {
                let mirrorRelationship = toClass.relationships.filter(r => r.name === relationship.mirrorRelationship);
                if (mirrorRelationship.length === 0) {
                    throw new Error('Invalid two-way relationship. ' + 
                        this.className + '.' + relationship.name + ' is missing mirror relationship ' + 
                        toClass.className + '.' + relationship.mirrorRelationship + '.'
                    );
                }
                mirrorRelationship = mirrorRelationship[0];

                if (mirrorRelationship.toClass !== this.className) {
                    throw new Error('Invalid two-way relationship. ' + 
                        this.className + '.' + relationship.name + '. Mirror relationship ' + 
                        toClass.className + '.' + relationship.mirrorRelationship + 
                        ' has incorrect toClass: ' + mirrorRelationship.toClass + '.'
                    );
                }

                if (mirrorRelationship.mirrorRelationship !== relationship.name) {
                    throw new Error('Invalid two-way relationship. ' + 
                        this.className + '.' + relationship.name + '. Mirror relationship ' + 
                        toClass.className + '.' + relationship.mirrorRelationship + 
                        ' has incorrect mirrorRelationship: ' + mirrorRelationship.mirrorRelationship + '.'
                    );
                }
            }
        }
    }

    inheritStaticMethods(fromClass) {
        for (const staticMethod of Object.keys(fromClass.staticMethods)) {
            if (!Object.keys(this.staticMethods).includes(staticMethod)) {
                this.staticMethods[staticMethod] = fromClass.staticMethods[staticMethod];
            }
        }
    }

    inheritNonStaticMethods(fromClass) {
        for (const nonStaticMethod of Object.keys(fromClass.nonStaticMethods)) {
            if (!Object.keys(this.nonStaticMethods).includes(nonStaticMethod)) {
                this.nonStaticMethods[nonStaticMethod] = fromClass.nonStaticMethods[nonStaticMethod];
            }
        }
    }

    // Runs validations and indexing, run after ALL class models have been created.
    static async finalize() {
        for (const classModel of AllClassModels) { 
            classModel.validateRelationships();
        }
        for (const classModel of AllClassModels) {
            await classModel.index();
        }
    }

    // to String
    toString() {
        return this.className + '\n';
    }

    isInstanceOfThisClass(instance) {
        if (instance.classModel === this)
            return true;

        return instance.classModel.allSuperClasses().map(c => c.className).includes(this.className);
    }

    isInstanceSetOfThisClass(instanceSet) {
        if (instanceSet.classModel === this)
            return true;

        return instanceSet.classModel.allSuperClasses().map(c => c.className).includes(this.className);
    }

    getRelatedClassModel(relationshipName) {
        return AllClassModels[this.relationships.filter(relationship => relationship.name === relationshipName)[0].toClass];
    }

    static getClassModel(className) {
        return AllClassModels[className];
    }

    validateAttribute(attributeName, value) {
        const attribute = this.attributes.filter(attribute => attribute.name === attributeName);

        if (attribute.length === 0)
            throw new Error('classModel.validateAttribute() called with an invalid attribute name.');

        attribute[0].validate(value);
    }

    valueValidForSingularRelationship(value, relationshipName) {
        const relationship = this.relationships.filter(relationship => relationship.name === relationshipName && relationship.singular);
        if (relationship.length === 0)
            throw new Error('classModel.valueValidForSingularRelationship() called with an invalid relationship name.');

        const toClass = AllClassModels[relationship[0].toClass];

        if (value === null)
            return true;

        if (!(value instanceof Instance))
            return false;

        if (!toClass.isInstanceOfThisClass(value))
            return false;

        return true;
    }

    valueValidForNonSingularRelationship(value, relationshipName) {
        const relationship = this.relationships.filter(relationship => relationship.name === relationshipName && !relationship.singular);
        if (relationship.length === 0)
            throw new Error('classModel.valueValidForNonSingularRelationship() called with an invalid relationship name.');

        const toClass = AllClassModels[relationship[0].toClass];

        if (value === null)
            return true;

        if (!(value instanceof InstanceSet))
            return false;

        if (!toClass.isInstanceSetOfThisClass(value))
            return false;

        return true;
    }

    cardinalityOfRelationship(relationshipName) {
        const relationship = this.relationships.filter(r => r.name === relationshipName)[0];

        const cardinality = {
            from: null,
            to: null,
        };

            
        if (relationship.singular) {
            cardinality.to = '1';
        }
        else {
            cardinality.to = 'many';
        }
            
        if (relationship.mirrorRelationship !== undefined) {
            const mirrorRelationship = AllClassModels[relationship.toClass].relationships.filter(x => x.name === relationship.mirrorRelationship)[0];


            if (mirrorRelationship.singular) {
                cardinality.from = '1';
            }
            else {
                cardinality.from = 'many';
            }
        }

        return cardinality;
    }

    discriminated() {
        for (const subClass of this.subClasses) {
            if (subClass.useSuperClassCollection)
                return true;
        }
        return false;
    }

    /*
     * Helper function for findById and findOne
     * Loops through promises one at a time and returns the first non null resolution. Will break the loop on the first non-null resolution.
     *   If none of the promises return a non-null value, null is returned.
     */
    static async firstNonNullPromiseResolution(promises) {
        for (var index in promises) {
            let foundInstance = await promises[index];

            if (foundInstance != null) {
                return foundInstance;
                break;
            }
            else if (index == promises.length - 1) {
                return null;
            }
        }
    }

    /*
     * Helper function for find
     * Loops through promises one at a time and pushes the results to the results array.
     */
    async allPromiseResoltionsInstanceSets(promises) {
        let results = new InstanceSet(this);

        for (var promise of promises) {
            let singleResult = await promise;
            if (!singleResult.isEmpty())
                results.addInstances(singleResult);
        }

        return results;
    }

    /* 
     * A function which can filter an array of instances using an asynchronus function.
     */
    static async asyncFilter(instances, asyncFilterFunction) {
        let filtered = [];
        let filterPromises = [];

        instances.forEach((instance) => {
            filterPromises.push(asyncFilterFunction(instance));
        });

        let instanceIndex;

        for (instanceIndex = 0; instanceIndex < instances.length; instanceIndex++)  
            if (await filterPromises[instanceIndex])
                filtered.push(instances[instanceIndex]);
            
        return filtered;
    }

    isSuperClass() {
        return (this.subClasses && this.subClasses.length)
    }

    allSuperClasses() {
        const superClasses = new SuperSet(this.superClasses);

        for (const superClass of this.superClasses) {
            superClasses.addFromIterable(superClass.allSuperClasses())
        }

        return [...superClasses];
    }

    emptyInstanceSet() {
        return new InstanceSet(this);
    }


    // Insert, Update, Delete Methods

    async insertOne(document) {
        return db.insertOne(this.collection, document);
    }
    
    async insertMany(documents) {
        return db.insertMany(this.collection, documents);
    }

    async update(instance) {
        return db.update(this.collection, instance);
    }

    async overwrite(instance) {
        return db.overwrite(this.collection, instance);
    }

    async delete(instance) {

        if (instance.classModel !== this)
            throw new Error(this.className + '.delete() called on an instance of a different class.');

        return db.deleteOne(this.collection, instance);
    }

    // Query Methods

    /* Finds instances of this ClassModel using the given query filter in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Required Parameter queryFilter - A mongo query object
     * Rest Parameter readControlMethodParameters - Optional parameters used by this ClassModels read control method. 
     * Returns a promise, which will resolve with the instance with the given query filter if it can be found, otherwise null.
     */
    async find(queryFilter, ...readControlMethodParameters) {
        const unfiltered = await this.pureFind(queryFilter);
        return this.readControlFilter(unfiltered, ...readControlMethodParameters);
    }

    async pureFind(queryFilter) {
        const foundInstances = new InstanceSet(this);

        const subClassesWithDifferentCollections = this.subClasses ? this.subClasses.filter(subClass => !subClass.useSuperClassCollection) : [];

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (this.abstract && !this.isSuperClass())
            throw new Error('Error in ' + this.className + '.find(). This class is abstract and non-discriminated, but it has no sub-classes.');

        if (this.useSuperClassCollection) {
            queryFilter.__t = this.className;
        }

        if (this.collection) {
            const documentsFoundInThisCollection = await db.find(this.collection, queryFilter); 
            const instancesFoundInThisCollection = new InstanceSet(this, documentsFoundInThisCollection.map(document => { 
                if (document.__t)
                    return new Instance(AllClassModels[document.__t], document);
                return new Instance(this, document);
            }));
            //const instancesFoundInThisCollectionFiltered = await this.readControlFilter(instancesFoundInThisCollection, ...readControlMethodParameters)
            foundInstances.addInstances(instancesFoundInThisCollection);
        }
        
        const promises = [];
  
        for (const subClass of subClassesWithDifferentCollections) {
            delete queryFilter.__t;
            promises.push(subClass.pureFind(queryFilter));
        }

        const instancesFoundOfSubClasses = await this.allPromiseResoltionsInstanceSets(promises);
        
        foundInstances.addInstances(instancesFoundOfSubClasses)
        return foundInstances;
    }

    /* Finds an instance of this ClassModel using the given query filter in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Required Parameter queryFilter - A mongo query object.
     * Rest Parameter readControlMethodParameters - Optional parameters used by this ClassModels read control method. 
     * Returns a promise, which will resolve with the instance with the given query filter if it can be found, otherwise null.
     */
    async findOne(queryFilter, ...readControlMethodParameters) {
        const unfiltered = await this.pureFindOne(queryFilter);
        return unfiltered === null ? null : this.readControlFilterInstance(unfiltered, ...readControlMethodParameters);
    }


    async pureFindOne(queryFilter) {
        const subClassesWithDifferentCollections = this.subClasses ? this.subClasses.filter(subClass => !subClass.useSuperClassCollection) : [];

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (this.abstract && !this.isSuperClass())
            throw new Error('Error in ' + this.className + '.findOne(). This class is abstract and non-discriminated, but it has no sub-classes.');

        if (this.useSuperClassCollection) {
            queryFilter.__t = this.className;
        }

        if (this.collection) {
            const documentFoundInThisCollection = await db.findOne(this.collection, queryFilter);

            if (documentFoundInThisCollection !== null) {
                if (documentFoundInThisCollection.__t)
                    return new Instance(AllClassModels[documentFoundInThisCollection.__t], documentFoundInThisCollection);
                else 
                    return new Instance(this, documentFoundInThisCollection);
            }

            if (subClassesWithDifferentCollections.length == 0)
                return null;
        }

        delete queryFilter.__t;

        const promises = [];
        // Call findOne on our subclasses as well.
        for (let subClass of subClassesWithDifferentCollections)
            promises.push(subClass.pureFindOne(queryFilter));

        return ClassModel.firstNonNullPromiseResolution(promises);
    }

    /* Finds an instance of this ClassModel with the given id in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Parameter id - the Object ID of the instance to find.
     * Returns a promise, which will resolve with the instance with the given id if it can be found, otherwise null.
     */
    async findById(id, ...readControlMethodParameters) {
        return this.findOne({_id: id}, ...readControlMethodParameters);
    }

    async pureFindById(id) {
        return this.pureFindOne({_id: id});
    }

    async updateRelatedInstancesForInstance(instance) {
        const relatedDiff = instance.relatedDiffs();
        const reducedRelatedDiff = instance.reducedRelatedDiffs(relatedDiff);
        const instanceSet = new InstanceSet(NoommanClassModel);

        // Retrieve all related instances and collect them in an instanceSet.
        for (const relationshipName of Object.keys(relatedDiff)) {
            const relationship = this.relationships.filter(r => r.name === relationshipName)[0];
            const relatedInstances = await instance.walk(relationshipName);
            const previousRelatedInstances = await instance.walk(relationshipName, true);

            if (relationship.singular) {
                if (relatedInstances !== null) {
                    instanceSet.add(relatedInstances);
                }
                if (previousRelatedInstances !== null) {
                    instanceSet.add(previousRelatedInstances);
                }
            }
            else {
                if (relatedInstances instanceof InstanceSet && !relatedInstances.isEmpty()) {
                    instanceSet.addInstances(relatedInstances);
                }
                if (previousRelatedInstances instanceof InstanceSet && !previousRelatedInstances.isEmpty()) {
                    instanceSet.addInstances(previousRelatedInstances);
                }
            }

        }

        // Apply changes to related instances
        for (const id of Object.keys(reducedRelatedDiff)) {
            const relatedInstance = instanceSet.getInstanceWithId(id);
            relatedInstance.applyChanges(reducedRelatedDiff[id]);
        }

        return instanceSet.saveWithoutRelatedUpdates();
    }

    async updateRelatedInstancesForInstanceSet(instanceSet) {
        const relationshipsNeedingUpdate = new SuperSet();
        const reducedRelatedDiffs = [];

        if (!(instanceSet instanceof InstanceSet) || instanceSet.isEmpty()) {
            return;
        }

        for (const instance of instanceSet) {
            const relatedDiff = instance.relatedDiffs();
            const relationshipsToUpdateForInstance = Object.keys(relatedDiff);
            for (const relationshipName of relationshipsToUpdateForInstance) {
                relationshipsNeedingUpdate.add(relationshipName);
            }
            if (relationshipsToUpdateForInstance.length) {
                reducedRelatedDiffs.push(relatedDiff);
            }
        }

        if (relationshipsNeedingUpdate.isEmpty()) {
            return;
        }

        const combinedDiff = Diffable.combineMultipleReducedDiffs(reducedRelatedDiffs);
        const allRelatedInstances = new InstanceSet(NoommanClassModel);

        // Retrieve all related instances and collect them in an instanceSet.
        for (const relationshipName of relationshipsNeedingUpdate) {
            const relatedInstances = await instanceSet.walk(relationshipName);
            const previousRelatedInstances = await instanceSet.walk(relationshipName, true);

            if (relatedInstances instanceof InstanceSet && !relatedInstances.isEmpty()) {
                allRelatedInstances.addInstances(relatedInstances);
            }
            if (previousRelatedInstances instanceof InstanceSet && !previousRelatedInstances.isEmpty()) {
                allRelatedInstances.addInstances(previousRelatedInstances);
            }
        }

        // Apply changes to related instances
        for (const id of Object.keys(combinedDiff)) {
            const relatedInstance = allRelatedInstances.getInstanceWithId(id);
            relatedInstance.applyChanges(combinedDiff[id]);
        }

        return allRelatedInstances.saveWithoutRelatedUpdates();
    }

    // Crud Control Methods

    async evaluateCrudControlMethods(instanceSet, controlMethods, ...methodParameters) {
        let rejectedInstances = new InstanceSet(this);

        const instancesOfThisClass = instanceSet.filterToInstanceSet(instance => {
            return instance.classModel === this;
        });

        for (const instance of instancesOfThisClass) {
            for (const controlMethod of this[controlMethods]) {
                let result = controlMethod.apply(instance, methodParameters);
                if (result instanceof Promise) {
                    result = await result;
                }
                if (!result) {
                    rejectedInstances.add(instance);
                    continue;
                }
            }
        }

        if (this.isSuperClass()) {
            for (let subClass of this.subClasses) {
                let instancesOfSubClass = instanceSet.filterForClassModel(subClass);

                if (!instancesOfSubClass.isEmpty()) {
                    const rejectedSubClassInstances = await subClass.evaluateCrudControlMethods(instancesOfSubClass, controlMethods, ...methodParameters);
                    rejectedInstances.addFromIterable(rejectedSubClassInstances);
                }
            }
        }

        return rejectedInstances;

    }

    async createControlCheck(instanceSet, ...createControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.createControlCheck(InstanceSet instanceSet, ...createControlMethodParameters)');
        
        if (instanceSet.isEmpty() || !this.createControlMethods.length)
            return;

        const rejectedInstances = await this.evaluateCrudControlMethods(instanceSet, 'createControlMethods', ...createControlMethodParameters);

        if (!rejectedInstances.isEmpty())
            throw new Error('Illegal attempt to create instances: ' + rejectedInstances.getInstanceIds());
    }

    async createControlCheckInstance(instance, ...createControlMethodParameters) {
        const instanceSet = new InstanceSet(instance.classModel, [instance]);
        return this.createControlCheck(instanceSet, ...createControlMethodParameters);
    }

    /* Takes an array of instances of the Class Model and filters out any that do not pass this Class Model's read control method.
     * @param required Array<instance> : An array of instances of this Class Model to filter.
     * @return Promise(Array<Instance>): The given instances filtered for read control.
     */

    async readControlFilter(instanceSet, ...readControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.readControlFilter(InstanceSet instanceSet, ...readControlMethodParameters)');
        
        // If InstanceSet is empty or not read controlled, just return a copy of it.
        if (!instanceSet.size || this.readControlMethods.length === 0)
            return new InstanceSet(this, instanceSet);

        const rejectedInstances = await this.evaluateCrudControlMethods(instanceSet, 'readControlMethods', ...readControlMethodParameters);

        return instanceSet.difference(rejectedInstances);
    }

    async readControlFilterInstance(instance, ...readControlMethodParameters) {
        const instanceSet = new InstanceSet(this, [instance]);
        const filteredInstanceSet = await this.readControlFilter(instanceSet, ...readControlMethodParameters);
        return filteredInstanceSet.isEmpty() ? null : [...instanceSet][0];
    }

    async updateControlCheck(instanceSet, ...updateControlParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.updateControlCheck(InstanceSet instanceSet, ...updateControlMethodParameters)');

        if (instanceSet.isEmpty() || !this.updateControlMethods.length)
            return;

        const rejectedInstances = await this.evaluateCrudControlMethods(instanceSet, 'updateControlMethods', ...updateControlParameters);

        if (!rejectedInstances.isEmpty())
            throw new Error('Illegal attempt to update instances: ' + rejectedInstances.getInstanceIds());
    }

    async updateControlCheckInstance(instance, ...updateControlMethodParameters) {
        const instanceSet = new InstanceSet(instance.classModel, [instance]);
        return this.updateControlCheck(instanceSet, ...updateControlMethodParameters);
    }

    async deleteControlCheck(instanceSet, ...deleteControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.deleteControlCheck(InstanceSet instanceSet, ...deleteControlMethodParameters)');

        if (instanceSet.isEmpty() || !this.deleteControlMethods.length)
            return;

        const rejectedInstances = await this.evaluateCrudControlMethods(instanceSet, 'deleteControlMethods', ...deleteControlMethodParameters);

        if (!rejectedInstances.isEmpty())
            throw new Error('Illegal attempt to delete instances: ' + rejectedInstances.getInstanceIds());
    }

    async deleteControlCheckInstance(instance, ...deleteControlMethodParameters) {
        const instanceSet = new InstanceSet(instance.classModel, [instance]);
        return this.deleteControlCheck(instanceSet, ...deleteControlMethodParameters);
    }

    async sensitiveControlFilter(instanceSet, ...sensitiveControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.sensitiveControlFilter(InstanceSet instanceSet, ...sensitiveControlMethodParameters)');
        
        // If InstanceSet is empty or not sensitive controlled, just return a copy of it.
        if (!instanceSet.size || this.sensitiveControlMethods.length === 0)
            return new InstanceSet(this, instanceSet);

        const rejectedInstances = await this.evaluateCrudControlMethods(instanceSet, 'sensitiveControlMethods', ...sensitiveControlMethodParameters);

        return rejectedInstances;
    }

    async sensitiveControlFilterInstance(instance, ...sensitiveControlMethodParameters) {
        const instanceSet = new InstanceSet(this, [instance]);
        const rejectedInstances = await this.sensitiveControlFilter(instanceSet, ...sensitiveControlMethodParameters);
        return rejectedInstances.size > 0 ? instance : null;
    }

    async deleteMany(instances) {
        return db.deleteMany(this.collection, instances);
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    async clear() {
        if (this.abstract && !this.discriminated())
            throw new Error('Cannot call clear() on an abstract, non-discriminated class. Class: ' + classModel.className);

        if (this.useSuperClassCollection) {
            return db.collection(this.collection).deleteMany({ __t: this.className });
        }
        else {
            return db.collection(this.collection).deleteMany({});
        }        
    }
}

const NoommanClassModel = new ClassModel({
    className: 'NoommanClassModel',
    abstract: true,
});

module.exports = ClassModel;
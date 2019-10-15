/*
  Description: Defines an application class model.
*/
require('@babel/polyfill');

var db = require('./database');
const InstanceSet = require('./InstanceSet');
const Instance = require('./Instance');
const Attribute = require('./Attribute');
const Relationship = require('./Relationship');

const AllClassModels = [];

class ClassModel {

    constructor(schema) {

        this.constructorValidations(schema);

        this.className = schema.className;
        this.subClasses = [];
        this.discriminatedSubClasses = [];
        this.abstract = schema.abstract;
        this.discriminated = schema.discriminated;
        this.accessControlled = schema.accessControlled;
        this.accessControlMethod = schema.accessControlMethod ? schema.accessControlMethod : undefined;
        this.updateControlled = schema.updateControlled;
        this.updateControlMethod = schema.updateControlMethod ? schema.updateControlMethod : undefined;
        this.superClasses = schema.superClasses ? schema.superClasses : [];
        this.discriminatorSuperClass = schema.discriminatorSuperClass;
        this.collection = schema.discriminatorSuperClass ? schema.discriminatorSuperClass.collection : schema.className.toLowerCase();

        if (schema.discriminatorSuperClass) {
            this.collection = schema.discriminatorSuperClass.collection;
        }
        else {
            const lastLetter = schema.className.substr(-1).toLowerCase();
            this.collection = schema.className.toLowerCase();
            if (lastLetter === 's') {
                this.collection = this.collection + 'e';
            }
            this.collection = this.collection + 's';
        }


        // Access Control Settings
        if (schema.accessControlled === undefined) {
            throw new Error('accessControlled is required.');
        }

        if (schema.accessControlled && !this.allAccessControlMethodsforClassModel().length) {
            throw new Error('If a class is accessControlled, it must have an accessControlMethod, or it must have at least one super class with an accessControlMethod.');
        }

        if (!schema.accessControlled) {
            if (schema.accessControlMethod) {
                throw new Error('A class that is not accessControlled cannot have an accessControlMethod.');
            }

            if (schema.superClasses) {
                schema.superClasses.forEach(function(superClass) {
                    if (superClass.accessControlled) {
                        throw new Error('A class which is not accessControlled cannot be a sub class of a class which is accessControlled.');
                    }
                });
            }

            if (schema.discriminatorSuperClass) {
                if (schema.discriminatorSuperClass.accessControlled) {
                    throw new Error('A subclass of a accessControlled discriminated super class must also be accessControlled.');
                }
            }
        } 

        // Update Control Settings
        if (schema.updateControlled === undefined) {
            throw new Error('updateControlled is required.');
        }

        if (schema.updateControlled && !this.allUpdateControlMethodsforClassModel().length) {
            throw new Error('If a class is updateControlled, it must have an updateControlMethod, or it must have at least one super class with an updateControlMethod.');
        }

        if (!schema.updateControlled) {
            if (schema.updateControlMethod) {
                throw new Error('A class that is not updateControlled cannot have an updateControlMethod.');
            }

            if (schema.superClasses) {
                schema.superClasses.forEach(function(superClass) {
                    if (superClass.updateControlled) {
                        throw new Error('A class which is not updateControlled cannot be a sub class of a class which is updateControlled.');
                    }
                });
            }

            if (schema.discriminatorSuperClass) {
                if (schema.discriminatorSuperClass.updateControlled) {
                    throw new Error('A subclass of a updateControlled discriminated super class must also be updateControlled.');
                }
            }
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

        if (schema.superClasses) {
            for (const superClass of schema.superClasses) {
                this.attributes = this.attributes.concat(superClass.attributes);
                this.relationships = this.relationships.concat(superClass.relationships);
                superClass.subClasses.push(this);
            }
        }

        if (schema.discriminatorSuperClass) {
            this.attributes = this.attributes.concat(schema.discriminatorSuperClass.attributes);
            this.relationships = this.relationships.concat(schema.discriminatorSuperClass.relationships);
            schema.discriminatorSuperClass.discriminatedSubClasses.push(this);
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

        if (schema.discriminatorSuperClass && Array.isArray(schema.discriminatorSuperClass))
            throw new Error('If discriminatorSuperClass is set, it can only be a single class.');

        if (schema.superClasses && schema.discriminatorSuperClass)
            throw new Error('A ClassModel cannot have both superClasses and discriminatorSuperClass.');

        if (schema.discriminatorSuperClass && !schema.discriminatorSuperClass.discriminated)
            throw new Error('If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.');
        
        if (schema.superClasses)
            schema.superClasses.forEach(function(superClass) {
                if (superClass.discriminated)
                    throw new Error('If a class is set as a superClass, that class cannot have its "discriminated" field set to true.');
            });

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
            }
        }

        if (schema.discriminatorSuperClass && schema.abstract) 
            throw new Error('A discriminator sub class cannot be abstract.');

        if (schema.discriminatorSuperClass && schema.discriminated)
            throw new Error('A sub class of a discriminated super class cannot be discriminated.');

        if (schema.superClasses) {
            schema.superClasses.forEach(function(superClass) {
                if (superClass.discriminatorSuperClass) {
                    throw new Error('A class cannot be a sub class of a sub class of a discriminated class.');
                }
            });
        }

    }

    // to String
    toString() {
        return this.className + '\n';
    }

    isInstanceOfThisClass(instance) {
        if (instance.classModel === this)
            return true;
        
        for (const subClass of this.subClasses) {
            if (subClass.isInstanceOfThisClass(instance))
                return true;
        }

        for (const subClass of this.discriminatedSubClasses) {
            if (subClass.isInstanceOfThisClass(instance))
                return true;
        }

        return false;
    }

    isInstanceSetOfThisClass(instanceSet) {
        if (instanceSet.classModel === this)
            return true;
        
        for (const subClass of this.subClasses) {
            if (subClass.isInstanceOfThisClass(instanceSet))
                return true;
        }

        for (const subClass of this.discriminatedSubClasses) {
            if (subClass.isInstanceOfThisClass(instanceSet))
                return true;
        }

        return false;
    }

    getRelatedClassModel(relationshipName) {
        return AllClassModels[this.relationships.filter(relationship => relationship.name === relationshipName)[0].toClass];
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
        return ((this.subClasses && this.subClasses.length) || this.discriminated)
    }


    // Insert, Update, Delete Methods

    async insertOne(document) {
        return db.insertOne(this.collection, document);
    }
    
    async insertMany(documents) {
        return db.insertMany(this.collection, documents);
    }

    async update(document) {
        return db.update(this.collection, document);
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
     * Rest Parameter accessControlMethodParameters - Optional parameters used by this ClassModels access control method. 
     * Returns a promise, which will resolve with the instance with the given query filter if it can be found, otherwise null.
     */
    async find(queryFilter, ...accessControlMethodParameters) {
        const concrete = !this.abstract;
        const abstract = this.abstract;
        const discriminated = this.discriminated;
        const isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        const subClasses = this.subClasses;
        const className = this.className;

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (abstract && !isSuperClass)
            throw new Error('Error in ' + className + '.find(). This class is abstract and non-discriminated, but it has no sub-classes.');

        // If this is a discriminated class, or it is a concrete class with no subclasses, find the instance in this ClassModel's collection.
        if ((concrete && !isSuperClass) || discriminated) {
            const foundDocuments = await db.find(this.collection, queryFilter);
            const foundInstances = foundDocuments.map(document => { 
                if (document.__t)
                    return new Instance(AllClassModels[document.__t], document);
                return new Instance(this, document);
            });
            const foundInstanceSet = new InstanceSet(this, foundInstances);
            return this.accessControlFilter(foundInstanceSet, ...accessControlMethodParameters);
        }

        // If this is a non-discriminated super class, we may need to check this classmodel's collection as well,
        //  as well as the subclasses collections.
        if (isSuperClass && !discriminated) {
            let promises = [];
            let filteredInstancesOfThisClass;

            if (concrete) {
                let foundDocumentsOfThisClass = await db.find(this.collection, queryFilter);

                if (foundDocumentsOfThisClass.length) {
                    const foundInstances = foundDocumentsOfThisClass.map(instance => { return new Instance(this, instance)});
                    const foundInstancesOfThisClass = new InstanceSet(this, foundInstances);
                    filteredInstancesOfThisClass = await this.accessControlFilter(foundInstancesOfThisClass, ...accessControlMethodParameters);
                }
            }
            for (let subClass of subClasses)
                promises.push(subClass.find(queryFilter, ...accessControlMethodParameters));

            let foundInstances = await this.allPromiseResoltionsInstanceSets(promises);
            
            foundInstances.addInstances(filteredInstancesOfThisClass)
            return foundInstances;
        }
    }

    /* Finds an instance of this ClassModel using the given query filter in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Required Parameter queryFilter - A mongo query object.
     * Rest Parameter accessControlMethodParameters - Optional parameters used by this ClassModels access control method. 
     * Returns a promise, which will resolve with the instance with the given query filter if it can be found, otherwise null.
     */
    async findOne(queryFilter, ...accessControlMethodParameters) {
        const concrete = !this.abstract;
        const abstract = this.abstract;
        const discriminated = this.discriminated;
        const isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        const subClasses = this.subClasses;
        const className = this.className;

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (abstract && !isSuperClass)
            throw new Error('Error in ' + className + '.findOne(). This class is abstract and non-discriminated, but it has no sub-classes.');

        // If this is a discriminated class, or it is a concrete class with no subclasses, find the instance in this ClassModel's collection.
        if ((concrete && !isSuperClass) || discriminated) {
            const documentFound = await db.findOne(this.collection, queryFilter);
            if (!documentFound)
                return null;

            let instanceFound;

            if (!discriminated)
                instanceFound = new Instance(this, documentFound);
            else {
                if (documentFound.__t) {
                    const classModelForInstance = AllClassModels[documentFound.__t];
                    instanceFound = new Instance(classModelForInstance, documentFound);
                }
                else {
                    instanceFound = new Instance(this, documentFound);
                }
            }

            const filteredInstance = await this.accessControlFilterOne(instanceFound, ...accessControlMethodParameters);
            return filteredInstance ? filteredInstance : null;
        }
        // If this is a non-discriminated super class, we may need to check this classmodel's collection as well,
        //  as well as the subclasses collections.
        if (isSuperClass && !discriminated) {
            let promises = [];

            // If this is a concrete super class, we need to check this ClassModel's own collection.
            if (concrete){
                const documentFound = await db.findOne(this.collection, queryFilter);
                if (documentFound) {
                    let instanceFound = new Instance(this, documentFound);

                    const filteredInstance = await this.accessControlFilterOne(instanceFound, ...accessControlMethodParameters)
                    return filteredInstance ? filteredInstance : null;
                }
            }

            // Call findOne on our subclasses as well.
            for (let subClass of subClasses)
                promises.push(subClass.findOne(queryFilter));

            return ClassModel.firstNonNullPromiseResolution(promises);
        }
    }

    /* Finds an instance of this ClassModel with the given id in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Parameter id - the Object ID of the instance to find.
     * Returns a promise, which will resolve with the instance with the given id if it can be found, otherwise null.
     */
    async findById(id, ...accessControlMethodParameters) {
        return this.findOne({_id: id}, ...accessControlMethodParameters);
    }

    // Query Methods

    /* Finds instances of this ClassModel using the given query filter in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Required Parameter queryFilter - A mongo query object.
     * Rest Parameter accessControlMethodParameters - Optional parameters used by this ClassModels access control method. 
     * Returns a promise, which will resolve with the instance with the given query filter if it can be found, otherwise null.
     */
    async find2(queryFilter, ...accessControlMethodParameters) {
        const concrete = !this.abstract;
        const abstract = this.abstract;
        const discriminated = this.discriminated;
        const isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        const subClasses = this.subClasses;
        const className = this.className;
        const Model = this.Model;

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (abstract && !isSuperClass)
            throw new Error('Error in ' + className + '.find(). This class is abstract and non-discriminated, but it has no sub-classes.');

        // If this is a discriminated class, or it is a concrete class with no subclasses, find the instance in this ClassModel's collection.
        if ((concrete && !isSuperClass) || discriminated) {
            const foundDocuments = await Model.find(queryFilter).exec();
            const foundInstances = foundDocuments.map(document => { 
                if (document.__t)
                    return new Instance(AllClassModels[document.__t], document);
                return new Instance(this, document);
            });
            const foundInstanceSet = new InstanceSet(this, foundInstances);
            return this.accessControlFilter(foundInstanceSet, ...accessControlMethodParameters);
        }

        // If this is a non-discriminated super class, we may need to check this classmodel's collection as well,
        //  as well as the subclasses collections.
        if (isSuperClass && !discriminated) {
            let promises = [];
            let filteredInstancesOfThisClass;

            if (concrete) {
                let foundDocumentsOfThisClass = await Model.find(queryFilter).exec();

                if (foundDocumentsOfThisClass.length) {
                    const foundInstances = foundDocumentsOfThisClass.map(instance => { return new Instance(this, instance)});
                    const foundInstancesOfThisClass = new InstanceSet(this, foundInstances);
                    filteredInstancesOfThisClass = await this.accessControlFilter(foundInstancesOfThisClass, ...accessControlMethodParameters);
                }
            }
            for (let subClass of subClasses)
                promises.push(subClass.find(queryFilter, ...accessControlMethodParameters));

            let foundInstances = await this.allPromiseResoltionsInstanceSets(promises);
            
            foundInstances.addInstances(filteredInstancesOfThisClass)
            return foundInstances;
        }
    }

    // Security Methods

    /* A recursive method which retrieves all the access control methods that should be run on instances of a classmodel, including the classes own
     *    access control method and all the access control methods of its accessControlled parents.
     * @return An Array containing all the access control methods that should be run for a particular class model.
     */
    allAccessControlMethodsforClassModel() {
        if (!this.accessControlled)
            return [];
        
        let accessControlMethods = [];

        for (let superClass of this.superClasses) {
            accessControlMethods.push(...superClass.allAccessControlMethodsforClassModel());
        }

        if (this.discriminatorSuperClass)
            accessControlMethods.push(...this.discriminatorSuperClass.allAccessControlMethodsforClassModel());

        if (this.accessControlMethod)
            accessControlMethods.push(this.accessControlMethod);

        return accessControlMethods;
    }

    /* Takes an array of instances of the Class Model and filters out any that do not pass this Class Model's access control method.
     * @param required Array<instance> : An array of instances of this Class Model to filter.
     * @return Promise(Array<Instance>): The given instances filtered for access control.
     */
    async accessControlFilter(instanceSet, ...accessControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.accessControlFilter(InstanceSet instanceSet, ...accessControlMethodParameters)');

        // If InstanceSet is empty or not access controlled, just return a copy of it.
        if (!instanceSet.size || !this.accessControlled)
            return new InstanceSet(this, instanceSet);

        // Filter instances of this class using the relevant access control methods.
        const filtered = new InstanceSet(this);
        let accessControlMethods = this.allAccessControlMethodsforClassModel();
        let filteredInstanceSetOfThisClass;

        if (this.discriminated)
            filteredInstanceSetOfThisClass = instanceSet.filterToInstanceSet(instance => instance.__t === undefined);
        else
            filteredInstanceSetOfThisClass = instanceSet.filterForInstancesInThisCollection();
        
        let filteredInstancesOfThisClass = [...filteredInstanceSetOfThisClass];

        for (const accessControlMethod of accessControlMethods) {
            filteredInstancesOfThisClass = await ClassModel.asyncFilter(filteredInstancesOfThisClass, async (instance) => {
                return await accessControlMethod(instance, ...accessControlMethodParameters);
            });
        }

        filtered.addInstances(filteredInstancesOfThisClass);
        // Recursively call accessControlFilter() for sub classes
        let subClasses = [];

        if (this.subClasses.length)
            subClasses = this.subClasses;
        if (this.discriminatedSubClasses.length)
            subClasses = this.discriminatedSubClasses;
        
        for (let subClass of subClasses) {
            let instanceSetOfSubClass = instanceSet.filterForClassModel(subClass);

            if (instanceSetOfSubClass.size) {
                let filteredSubClassInstances = await subClass.accessControlFilter(instanceSetOfSubClass, ...accessControlMethodParameters);
                filtered.addInstances(filteredSubClassInstances);
            }
        }

        return filtered;
    }

    async accessControlFilterOne(instance, ...accessControlMethodParameters) {
        const instanceSet = new InstanceSet(this, [instance]);
        const filteredInstanceSet = await this.accessControlFilter(instanceSet, ...accessControlMethodParameters);
        return filteredInstanceSet.isEmpty() ? null : [...instanceSet][0];
    }

    /* A recursive method which retrieves all the update control methods that should be run on instances of a classmodel, including the classes own
     *    update control method and all the update control methods of its updateControlled parents.
     * @return An Array containing all the update control methods that should be run for a particular class model.
     */
    allUpdateControlMethodsforClassModel() {
        if (!this.updateControlled)
            return [];
        
        let updateControlMethods = [];

        for (let superClass of this.superClasses) {
            updateControlMethods.push(...superClass.allUpdateControlMethodsforClassModel());
        }

        if (this.discriminatorSuperClass)
            updateControlMethods.push(...this.discriminatorSuperClass.allUpdateControlMethodsforClassModel());

        if (this.updateControlMethod)
            updateControlMethods.push(this.updateControlMethod);

        return updateControlMethods;
    }

    async updateControlCheck(instance, ...updateControlMethodParameters) {
        const instanceSet = new InstanceSet(instance.classModel, [instance]);
        return this.updateControlCheckSet(instanceSet, ...updateControlMethodParameters);
    }

    async updateControlCheckSet(instanceSet, ...updateControlParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.updateControlCheckSet(InstanceSet instanceSet, ...updateControlMethodParameters)');

        if (instanceSet.isEmpty() || !this.updateControlled)
            return true;

        const rejectedInstances = await this.updateControlCheckSetRecursive(instanceSet, ...updateControlParameters);

        if (rejectedInstances.isEmpty())
            return true;
        else
            throw new Error('Illegal attempt to update instances: ' + rejectedInstances.getInstanceIds());
    }

    /* Recursive method to be called by updateControlCheck()
     * Required Parameter instances - Array<instance> : An array of instances of this Class Model to run update control method on.
     * Returns an InstanceSet containing instances which do not pass update control check.
     * }
     */
    async updateControlCheckSetRecursive(instanceSet, ...updateControlMethodParameters) {
        const updateControlMethods = this.allUpdateControlMethodsforClassModel();
        let rejectedInstances = new InstanceSet(this);

        const instancesOfThisClass = instanceSet.filterToInstanceSet(instance => {
            return instance.classModel === this;
        });

        let updatableInstancesOfThisClass = [...instancesOfThisClass];

        for (const updateControlMethod of updateControlMethods) {
            updatableInstancesOfThisClass = await ClassModel.asyncFilter(updatableInstancesOfThisClass, async (instance) => {
                return updateControlMethod(instance, ...updateControlMethodParameters);
            });
        }

        updatableInstancesOfThisClass = new InstanceSet(this, updatableInstancesOfThisClass);
        rejectedInstances = instancesOfThisClass.difference(updatableInstancesOfThisClass);

        if (this.isSuperClass()) {
            if (this.discriminated) {
                let instancesByClass = {};
                instancesByClass[this.className] = [];
    
                for (let instance of instanceSet)
                    if (instance.__t)
                        if (!instancesByClass[instance.__t])
                            instancesByClass[instance.__t] = [instance];
                        else
                            instancesByClass[instance.__t].push(instance);
                    else 
                        instancesByClass[this.className].push(instance);
    
                for (let className in instancesByClass) {
                    if (className != this.className) {
                        const subClassModel = AllClassModels[className];
                        const rejectedSubClassInstances = await subClassModel.updateControlCheckSetRecursive(new InstanceSet(subClassModel, instancesByClass[className]), ...updateControlMethodParameters);
                        rejectedInstances.addInstances(rejectedSubClassInstances);
                    }
                }
            }
            else if (this.subClasses.length) {
                for (let subClass of this.subClasses) {
                    let instancesOfSubClass = instanceSet.filterForClassModel(subClass);
    
                    if (!instancesOfSubClass.isEmpty()) {
                        const rejectedSubClassInstances = await subClass.updateControlCheckSetRecursive(instancesOfSubClass, ...updateControlMethodParameters);
                        rejectedInstances.addFromIterable(rejectedSubClassInstances);
                    }
                }
            }
        }

        return rejectedInstances;
    }

    async deleteMany(instances) {
        return db.deleteMany(this.collection, instances);
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    async clear() {
        if (this.abstract && !this.discriminated)
            throw new Error('Cannot call clear() on an abstract, non-discriminated class. Class: ' + classModel.className);

        if (this.discriminatorSuperClass) {
            return db.collection(this.collection).deleteMany({ __t: this.className });
        }
        else {
            return db.collection(this.collection).deleteMany({});
        }        
    }
}

module.exports = ClassModel;
/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/
require('@babel/polyfill');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const InstanceSet = require('./InstanceSet');
const Instance = require('./Instance');

const AllClassModels = [];

class ClassModel {

    constructor() {
        let parameters = arguments[0];
        
        if (!parameters.className)
            throw new Error('className is required.');
            
        if (!parameters.schema)
            throw new Error('schema is required.');

        if (parameters.superClasses && !Array.isArray(parameters.superClasses))
            throw new Error('If superClasses is set, it must be an Array.');

        if (parameters.superClasses && parameters.superClasses.length == 0)
            throw new Error('If superClasses is set, it cannot be an empty Array.');

        if (parameters.discriminatorSuperClass && Array.isArray(parameters.discriminatorSuperClass))
            throw new Error('If discriminatorSuperClass is set, it can only be a single class.');

        if (parameters.superClasses && parameters.discriminatorSuperClass)
            throw new Error('A ClassModel cannot have both superClasses and discriminatorSuperClass.');

        if (parameters.discriminatorSuperClass && !parameters.discriminatorSuperClass.discriminated)
            throw new Error('If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.');
        
        if (parameters.superClasses)
            parameters.superClasses.forEach(function(superClass) {
                if (superClass.discriminated)
                    throw new Error('If a class is set as a superClass, that class cannot have its "discriminated" field set to true.');
            });

        if (parameters.superClasses) {
            parameters.superClasses.forEach(function(superClass) {
                Object.keys(superClass.schema).forEach(function(key) {
                    if (key in parameters.schema)
                        throw new Error('Sub class schema cannot contain the same field names as a super class schema.');
                });
            });
        }

        if (parameters.discriminatorSuperClass && parameters.abstract) 
            throw new Error('A discriminator sub class cannot be abstract.');

        if (parameters.discriminatorSuperClass && parameters.discriminated)
            throw new Error('A sub class of a discriminated super class cannot be discriminated.');

        if (parameters.superClasses) {
            parameters.superClasses.forEach(function(superClass) {
                if (superClass.discriminatorSuperClass) {
                    throw new Error('A class cannot be a sub class of a sub class of a discriminated class.');
                }
            });
        }


        this.className = parameters.className;
        this.subClasses = [];
        this.discriminatedSubClasses = [];
        this.abstract = parameters.abstract;
        this.discriminated = parameters.discriminated;
        this.accessControlled = parameters.accessControlled;
        this.accessControlMethod = parameters.accessControlMethod ? parameters.accessControlMethod : undefined;
        this.updateControlled = parameters.updateControlled;
        this.updateControlMethod = parameters.updateControlMethod ? parameters.updateControlMethod : undefined;
        this.superClasses = parameters.superClasses ? parameters.superClasses : [];
        this.discriminatorSuperClass = parameters.discriminatorSuperClass;

        // Access Control Settings
        if (parameters.accessControlled === undefined) {
            throw new Error('accessControlled is required.');
        }

        if (parameters.accessControlled && !this.allAccessControlMethodsforClassModel().length) {
            throw new Error('If a class is accessControlled, it must have an accessControlMethod, or it must have at least one super class with an accessControlMethod.');
        }

        if (!parameters.accessControlled) {
            if (parameters.accessControlMethod) {
                throw new Error('A class that is not accessControlled cannot have an accessControlMethod.');
            }

            if (parameters.superClasses) {
                parameters.superClasses.forEach(function(superClass) {
                    if (superClass.accessControlled) {
                        throw new Error('A class which is not accessControlled cannot be a sub class of a class which is accessControlled.');
                    }
                });
            }

            if (parameters.discriminatorSuperClass) {
                if (parameters.discriminatorSuperClass.accessControlled) {
                    throw new Error('A subclass of a accessControlled discriminated super class must also be accessControlled.');
                }
            }
        } 

        // Update Control Settings
        if (parameters.updateControlled === undefined) {
            throw new Error('updateControlled is required.');
        }

        if (parameters.updateControlled && !this.allUpdateControlMethodsforClassModel().length) {
            throw new Error('If a class is updateControlled, it must have an updateControlMethod, or it must have at least one super class with an updateControlMethod.');
        }

        if (!parameters.updateControlled) {
            if (parameters.updateControlMethod) {
                throw new Error('A class that is not updateControlled cannot have an updateControlMethod.');
            }

            if (parameters.superClasses) {
                parameters.superClasses.forEach(function(superClass) {
                    if (superClass.updateControlled) {
                        throw new Error('A class which is not updateControlled cannot be a sub class of a class which is updateControlled.');
                    }
                });
            }

            if (parameters.discriminatorSuperClass) {
                if (parameters.discriminatorSuperClass.updateControlled) {
                    throw new Error('A subclass of a updateControlled discriminated super class must also be updateControlled.');
                }
            }
        } 

        let schema;

        // If this class has super classes, combine all the super class schemas and combine with the given parameters.schema, and set the
        //    SuperClasses.subClasses field to this class.
        if (parameters.superClasses) {
            let superClassSchemas = {};
            let currentClassModel = this;

            parameters.superClasses.forEach(function(superClass) {
                superClass.subClasses.push(currentClassModel);

                Object.assign(superClassSchemas, superClass.schema);
            });
            schema = Object.assign(superClassSchemas, parameters.schema);
        }
        else {
            schema = parameters.schema;
        }

        this.schema = schema;

        let schemaObject = new Schema(this.schema);

        // If discriminatorSuperClass is set, create the Model as a discriminator of that class. Otherwise create a stand-alone Model.
        if (this.discriminatorSuperClass) {
            this.Model = this.discriminatorSuperClass.Model.discriminator(this.className, schemaObject);
            this.discriminatorSuperClass.discriminatedSubClasses.push(this);
        }
        else {
            if (!this.abstract || (this.abstract && this.discriminated))
                this.Model = mongoose.model(this.className, schemaObject);
        }

        AllClassModels[this.className] = this;
    }

    // to String
    toString() {
        return this.className + '\n' + JSON.stringify(this.schema);
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

    propertyIsARelationship(propertyName) {
        const property = this.schema[propertyName]
        return property.type == Schema.Types.ObjectId || (Array.isArray(property.type) && property.type[0] == Schema.Types.ObjectId);
    }

    getRelatedClassModel(relationship) {
        return AllClassModels[this.schema[relationship].ref];
    }

    static isAttribute(object) {
        const attributeTypes = [String, Boolean, Number, Date];

        if (Array.isArray(object.type) && attributeTypes.includes(object.type[0]))
            return true;
        if (attributeTypes.includes(object.type))
            return true;
        return false; 
    }

    static isSingularRelationship(object) {
        if (Array.isArray(object.type))
            return false;
        if (object.type === Schema.Types.ObjectId)
            return true;
        return false;
    }


    static isNonSingularRelationship(object) {
        if (!Array.isArray(object.type))
            return false;
        if (object.type[0] === Schema.Types.ObjectId)
            return true;
        return false;
    }

    getAttributes() {
        const attributes = [];
        for (const key in this.schema) {
            if (ClassModel.isAttribute(this.schema[key])){
                let type = this.schema[key].type;
                let list = false;
                
                if (Array.isArray(this.schema[key].type)) {
                    type = this.schema[key].type[0];
                    list = true;
                }

                attributes.push({
                    name: key,
                    type: type,
                    list: list,
                    mutex: this.schema[key].mutex,
                    required: this.schema[key].required,
                    requiredGroup: this.schema[key].requiredGroup,
                });
            }
        }
        return attributes;
    }

    getSingularRelationships() {
        const relationships = [];
        for (const key in this.schema) {
            if (ClassModel.isSingularRelationship(this.schema[key]))
                relationships.push({
                    name: key,
                    toClass: this.schema[key].ref,
                    type: this.schema[key].type,
                    mutex: this.schema[key].mutex,
                    required: this.schema[key].required,
                    requiredGroup: this.schema[key].requiredGroup,
                });
        }
        return relationships;
    }

    getNonSingularRelationships() {
        const relationships = [];
        for (const key in this.schema) {
            if (ClassModel.isNonSingularRelationship(this.schema[key]))
                relationships.push({
                    name: key,
                    toClass: this.schema[key].ref,
                    type: this.schema[key].type,
                    mutex: this.schema[key].mutex,
                    required: this.schema[key].required,
                    requiredGroup: this.schema[key].requiredGroup,
                });
        }
        return relationships;
    }

    valueValidForSingularRelationship(value, relationshipName) {
        const relationship = this.getSingularRelationships().filter(relationship => relationship.name === relationshipName)[0];
        const toClass = AllClassModels[relationship.toClass];

        if (value === null || value === undefined)
            return true;

        if (!(value instanceof Instance))
            return false;

        if (!toClass.isInstanceOfThisClass(value))
            return false;

        return true;
    }

    valueValidForNonSingularRelationship(value, relationshipName) {
        const relationship = this.getNonSingularRelationships().filter(relationship => relationship.name === relationshipName)[0];
        const toClass = AllClassModels[relationship.toClass];

        if (value === null || value === undefined)
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

    async delete(instance) {
        let classModel = this;

        if (!(instance instanceof classModel.Model))
            reject(new Error(classModel.className + '.delete() called on an instance of a different class.'));


        return classModel.Model.deleteOne({_id: instance._id}).exec()
    }

    // Query Methods

    /* Finds instances of this ClassModel using the given query filter in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Required Parameter queryFilter - An object identifying filtering according to mongoose's definitions.
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
                //console.log(this.className + '.find() here');

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
     * Required Parameter queryFilter - An object identifying filtering according to mongoose's definitions.
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
        const Model = this.Model;

        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (abstract && !isSuperClass)
            throw new Error('Error in ' + className + '.findOne(). This class is abstract and non-discriminated, but it has no sub-classes.');

        // If this is a discriminated class, or it is a concrete class with no subclasses, find the instance in this ClassModel's collection.
        if ((concrete && !isSuperClass) || discriminated) {
            const documentFound = await Model.findOne(queryFilter).exec();
            if (!documentFound)
                return null;

            let instanceFound;

            if (!discriminated)
                instanceFound = new Instance(this, documentFound, true);
            else {
                if (documentFound.__t) {
                    const classModelForInstance = AllClassModels[documentFound.__t];
                    instanceFound = new Instance(classModelForInstance, documentFound, true);
                }
                else {
                    instanceFound = new Instance(this, documentFound, true);
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
                const documentFound = await Model.findOne(queryFilter).exec();
                if (documentFound) {
                    let instanceFound = new Instance(this, documentFound, true);

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

    // Clear the collection. Never run in production! Only run in a test environment.
    clear() {
        var classModel = this;

        return new Promise(function(resolve, reject) {	

            if (classModel.abstract && !classModel.discriminated)
                reject(new Error('Cannot call clear() on an abstract, non-discriminated class. Class: ' + classModel.className));

		    classModel.Model.deleteMany({}, function(err) {
                if (err) reject(err);
                else resolve();
            });
	    });
    }
}

module.exports = ClassModel;
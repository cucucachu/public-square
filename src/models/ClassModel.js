/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/
require('@babel/polyfill');
require('./database');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SuperSet = require('./SuperSet');
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

    // Helper Methods
    isInstanceOfClassOrSubClass(instance) {
        if (instance instanceof this.Model)
            return true;
                
        for (let index in this.subClasses)
            if (this.subClasses[index].isInstanceOfClassOrSubClass(instance)) 
                return true;

        return false;
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

    static fieldIsARelationship(field) {
        return field.type == Schema.Types.ObjectId || (Array.isArray(field.type) && field.type[0] == Schema.Types.ObjectId);
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
    static async allPromiseResultionsTrimmed(promises) {
        let results = [];

        for (var index in promises) {
            let singleResult = await promises[index];
            if (singleResult.length)
                results = results.concat(await promises[index]);
        }

        return results;
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

    delete(instance) {
        let classModel = this;

        return new Promise((resolve, reject) => {
            if (!(instance instanceof classModel.Model)) {
                reject(new Error(classModel.className + '.delete() called on an instance of a different class.'));
            }
            else {
                classModel.Model.deleteOne({_id: instance._id}, (error) => {
                    if (error)
                        reject(error);
                    else 
                        resolve();
                });
            }
        });
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

        //console.log(this.className + '.find() start');

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
            return this.accessControlFilterInstance(foundInstanceSet, ...accessControlMethodParameters);
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
                    filteredInstancesOfThisClass = await this.accessControlFilterInstance(foundInstancesOfThisClass, ...accessControlMethodParameters);
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

            const filteredInstance = this.accessControlFilterInstanceOne(instanceFound, ...accessControlMethodParameters)
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

                    const filteredInstance = this.accessControlFilterInstanceOne(instanceFound, ...accessControlMethodParameters)
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

    // Relationship Methods
    
    /* 
     * Walks a relationship from a given instance of this Class Model, returning the related instance or instances. 
     * @param required Object instance: An instance of this class model
     * @param required String relationship: the key for the desired relationship
     * @param optional Object filter: a filter Object used in the query to filter the returned instances.
     * @return Promise which when resolved returns the related instance if relationship is singular, or an Array of the related 
     *           instances if the relationship is non-singular.
     */ 
    async walk(instance, relationship, filter=null) {
        if (!instance || !relationship)
            throw new Error(this.className + '.walk() called with insufficient arguments. Should be walk(instance, relationship, <optional>filter).');

        if (!this.isInstanceOfClassOrSubClass(instance))
            throw new Error(this.className + '.walk(): First argument needs to be an instance of ' + this.className + '\'s classModel or one of its sub classes.');
        
        if (typeof(relationship) != 'string')
            throw new Error(this.className + '.walk(): Second argument needs to be a String.');
        
        if (!(relationship in this.schema))
            throw new Error(this.className + '.walk(): Second argument needs to be a field in ' + this.className + '\'s schema.');
        
        if (!ClassModel.fieldIsARelationship(this.schema[relationship]))
            throw new Error(this.className + '.walk(): field "' + relationship + '" is not a relationship.');
        
        if (filter && typeof(filter) !== "object")
            throw new Error(this.className + '.walk(): Third argument needs to be an object.');

        const relatedClass = AllClassModels[this.schema[relationship].ref];
        const singular = this.schema[relationship].type == Schema.Types.ObjectId;
        filter = filter ? filter : {}

            // If relationship is to a singular instance, use findOne()
        if (singular) {
            if (instance[relationship] == null) {
                return null;
            }
            else {
                Object.assign(filter, {
                    _id: instance[relationship],
                });
                return relatedClass.findOne(filter);
            }
        }
        // If nonsingular, use find()
        else {
            if (instance[relationship] == null || instance[relationship].length == 0) {
                return [];
            }
            else {
                Object.assign(filter, {
                    _id: {$in: instance[relationship]}
                });

                return relatedClass.find(filter);
            }
        }
    }
    
    /* 
     * Walks a relationship from a given instance of this Class Model, returning the related instance or instances. 
     * @param required Object instance: An instance of this class model
     * @param required String relationship: the key for the desired relationship
     * @param optional Object filter: a filter Object used in the query to filter the returned instances.
     * @return Promise which when resolved returns the related instance if relationship is singular, or an Array of the related 
     *           instances if the relationship is non-singular.
     */ 
    async walkInstance(instance, relationship, filter=null) {
        if (!instance || !relationship)
            throw new Error(this.className + '.walkInstance() called with insufficient arguments. Should be walkInstance(instance, relationship, <optional>filter).');

        if (!(instance instanceof Instance))
            throw new Error(this.className + '.walkInstance() called with an argument which is not an instance.');

        if (!(instance.isInstanceOf(this)))
            throw new Error(this.className + '.walkInstance(): First argument needs to be an instance of ' + this.className + '\'s classModel or one of its sub classes.');
        
        if (typeof(relationship) != 'string')
            throw new Error(this.className + '.walkInstance(): Second argument needs to be a String.');
        
        if (!(relationship in this.schema))
            throw new Error(this.className + '.walkInstance(): Second argument needs to be a field in ' + this.className + '\'s schema.');
        
        if (!ClassModel.fieldIsARelationship(this.schema[relationship]))
            throw new Error(this.className + '.walkInstance(): field "' + relationship + '" is not a relationship.');
        
        if (filter && typeof(filter) !== "object")
            throw new Error(this.className + '.walkInstance(): Third argument needs to be an object.');
    
        const relatedClass = AllClassModels[this.schema[relationship].ref];
        const singular = this.schema[relationship].type == Schema.Types.ObjectId;
        filter = filter ? filter : {}

            // If relationship is to a singular instance, use findOne()
        if (singular) {
            if (instance[relationship] == null) {
                return null;
            }
            else {
                Object.assign(filter, {
                    _id: instance[relationship],
                });
                return relatedClass.findOne(filter);
            }
        }
        // If nonsingular, use find()
        else {
            if (instance[relationship] == null || instance[relationship].length == 0) {
                return [];
            }
            else {
                Object.assign(filter, {
                    _id: {$in: instance[relationship]}
                });

                return relatedClass.find(filter);
            }
        }
    }

    walkValidations(instanceSet, relationship, filter) {
        if (!relationship) 
            throw new Error('InstanceSet.walk() called without no relationship.');

        if (typeof(relationship) !== 'string')
            throw new Error('InstanceSet.walk() relationship argument must be a String.');

        if (!(relationship in this.schema) || !ClassModel.fieldIsARelationship(this.schema[relationship]))
            throw new Error('InstanceSet.walk() called with an invalid relationship for ClassModel ' + this.className + '.');
        
        if (filter && typeof(filter) !== "object")
            throw new Error('InstanceSet.walk() filter argument must be an object.');
    }

    async walkInstanceSet(instanceSet, relationship, filter = null, ...accessControlMethodParameters) {
        this.walkValidations(instanceSet, relationship, filter);
    
        const relatedClass = AllClassModels[this.schema[relationship].ref];
        const singular = this.schema[relationship].type == Schema.Types.ObjectId;
        filter = filter ? filter : {};
        let instanceIdsToFind;

        if(instanceSet.isEmpty())
            return new InstanceSet(relatedClass);

        if (singular) {
            instanceIdsToFind = instanceSet.map(instance => instance[relationship]).filter(id => { return id != null });
        }
        else {
            instanceIdsToFind = instanceSet
                .map(instance => instance[relationship])
                .filter(ids => {
                     return (ids != null && ids.length); 
                    })
                .reduce((acc, cur) => acc.concat(cur));
        }
        instanceIdsToFind =  [...(new Set(instanceIdsToFind))];
        
        Object.assign(filter, {
            _id: {$in : instanceIdsToFind},
        });

        return relatedClass.find(filter, ...accessControlMethodParameters);
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
    async accessControlFilter(instances, ...accessControlMethodParameters) {
        if (!Array.isArray(instances))
            throw new Error('Incorrect parameters. ' + this.className + '.accessControlFilter(Array<instance> instances, ...accessControlMethodParameters)');

        // If instances is an empty array, return an empty array.
        if (!instances.length)
            return [];
        
        instances.forEach((instance) => {
            if (!this.isInstanceOfClassOrSubClass(instance))
                throw new Error(this.className + '.accessControlFilter() called with instances of a different class.');
        });

        let filtered = [];
        let index;
        const model = this.Model;
        let accessControlMethods = this.allAccessControlMethodsforClassModel();

        if (!this.accessControlled) {
            filtered = instances;
        }
        else if (this.subClasses.length) {
            let instancesOfThisClass = instances.filter(instance => { return instance instanceof model });

            for (index = 0; index < accessControlMethods.length; index++) {
                let accessControlMethod = accessControlMethods[index];

                instancesOfThisClass = await ClassModel.asyncFilter(instancesOfThisClass, accessControlMethod);
            }

            filtered = instancesOfThisClass;

            for (let subClass of this.subClasses) {
                let instancesOfSubClass = instances.filter(instance => {
                    return subClass.isInstanceOfClassOrSubClass(instance);
                });

                if (instancesOfSubClass.length) {
                    let filteredSubClassInstances = await subClass.accessControlFilter(instancesOfSubClass, ...accessControlMethodParameters);
                    filtered.push(...filteredSubClassInstances);
                }
            }

        }
        else if (this.discriminated) {
            let instancesByClass = {};
            instancesByClass[this.className] = [];

            for (let instance of instances) {
                if (instance.__t) {
                    if (!instancesByClass[instance.__t]) {
                        instancesByClass[instance.__t] = [instance];
                    }
                    else {
                        instancesByClass[instance.__t].push(instance);
                    }
                }
                else {
                    instancesByClass[this.className].push(instance);
                }
                
            }

            for (let className in instancesByClass) {
                if (className != this.className) {
                    let subClassModel = AllClassModels[className];
                    let filteredSubClassInstances = await subClassModel.accessControlFilter(instancesByClass[className], ...accessControlMethodParameters);
                    filtered.push(...filteredSubClassInstances);
                }
            }

            let instancesOfThisClass = instancesByClass[this.className];


            for (index = 0; index < accessControlMethods.length; index++) {
                let accessControlMethod = accessControlMethods[index];
                instancesOfThisClass = await ClassModel.asyncFilter(instancesOfThisClass, async (instance) => {
                    return await accessControlMethod(instance, ...accessControlMethodParameters);
                });
            }

            filtered.push(...instancesOfThisClass);
        }
        else {
            filtered = instances;

            for (index = 0; index < accessControlMethods.length; index++) {
                let accessControlMethod = accessControlMethods[index];
                filtered = await ClassModel.asyncFilter(filtered, async (instance) => {
                    return await accessControlMethod(instance, ...accessControlMethodParameters);
                });  
            }
        }

        return filtered;
    }

    /* Takes an array of instances of the Class Model and filters out any that do not pass this Class Model's access control method.
     * @param required Array<instance> : An array of instances of this Class Model to filter.
     * @return Promise(Array<Instance>): The given instances filtered for access control.
     */
    async accessControlFilterInstance(instanceSet, ...accessControlMethodParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.accessControlFilterInstance(InstanceSet instanceSet, ...accessControlMethodParameters)');

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

        // Recursively call accessControlFilterInstance() for sub classes
        let subClasses = [];

        if (this.subClasses.length)
            subClasses = this.subClasses;
        if (this.discriminatedSubClasses.length)
            subClasses = this.discriminatedSubClasses;
        
        for (let subClass of subClasses) {
            let instanceSetOfSubClass = instanceSet.filterForClassModel(subClass);

            if (instanceSetOfSubClass.size) {
                let filteredSubClassInstances = await subClass.accessControlFilterInstance(instanceSetOfSubClass, ...accessControlMethodParameters);
                filtered.addInstances(filteredSubClassInstances);
            }
        }

        return filtered;
    }

    async accessControlFilterInstanceOne(instance, ...accessControlMethodParameters) {
        const instanceSet = new InstanceSet(this, [instance]);
        const filteredInstanceSet = await this.accessControlFilterInstance(instanceSet, ...accessControlMethodParameters);
        return filteredInstanceSet.isEmpty() ? null : [...instanceSet][0];
    }

    /* Takes a single instance of the Class Model. If the instance passes this Class Model's access control method, it is returned,
     *  otherwise, returns null
     * Required Parameter - instance : An instance of this Class Model to filter.
     * Rest Parameter - accessControlMethodParameters - an array of parameters used by this ClassModel's access control method.
     * Returns Promise(Instance): The given instance or null.
     */
    async accessControlFilterOne(instance, ...accessControlMethodParameters) {
        if (!instance)
            return null;

        const filtered = await this.accessControlFilter([instance], ...accessControlMethodParameters);

        if (filtered.length) 
            return filtered[0];
        else
            return null;
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


    /* Takes an array of instances of the Class Model and checks that they can be updated accoding to the updateControlMethod for each isntance.
     * Required Parameter instances - Array<instance> : An array of instances of this Class Model to filter.
     * Rest Parameter updateControlParameters - The parameters needed for updateControlMethods.
     * Returns true if all the instances can be updated.
     * Throws an error if any instance cannot be updated. Error message contains Ids of instances which failed update control check.
     */
    async updateControlCheck(instances, ...updateControlParameters) {
        if (!Array.isArray(instances))
            throw new Error('Incorrect parameters. ' + this.className + '.updateControlCheck(Array<instance> instances, ...updateControlMethodParameters)');
        
        instances.forEach((instance) => {
            if (!this.isInstanceOfClassOrSubClass(instance))
                throw new Error(this.className + '.updateControlCheck() called with instances of a different class.');
        });

        // If instances is an empty array, return true.
        // THE !THIS.UPDATECONTROLLED PART IS A POTENTIAL SECURITY HOLE IF A SUBCLASS IS UPDATE CONTROLLED
        if (!instances.length || !this.updateControlled)
            return true;

        const rejectedInstances = await this.updateControlCheckRecursive(instances, ...updateControlParameters);

        if (rejectedInstances.isEmpty())
            return true;
        else {
            const rejectedInstanceIds = rejectedInstances.map(instance => instance.id);
            throw new Error('Illegal attempt to update instances: ' + rejectedInstanceIds);
        }
    }

    async updateControlCheckInstance(instance, ...updateControlMethodParameters) {
        const instanceSet = new InstanceSet(instance.classModel, [instance]);
        return this.updateControlCheckInstanceSet(instanceSet, ...updateControlMethodParameters);
    }

    async updateControlCheckInstanceSet(instanceSet, ...updateControlParameters) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('Incorrect parameters. ' + this.className + '.updateControlCheckInstanceSet(InstanceSet instanceSet, ...updateControlMethodParameters)');

        if (instanceSet.isEmpty() || !this.updateControlled)
            return true;

        const rejectedInstances = await this.updateControlCheckInstanceSetRecursive(instanceSet, ...updateControlParameters);

        if (rejectedInstances.isEmpty())
            return true;
        else
            throw new Error('Illegal attempt to update instances: ' + rejectedInstances.getInstanceIds());
    }

    /* Recursive method to be called by updateControlCheck()
     * Required Parameter instances - Array<instance> : An array of instances of this Class Model to run update control method on.
     * Returns an SuperSet containing instances which do not pass update control check.
     * }
     */
    async updateControlCheckRecursive(instances, ...updateControlMethodParameters) {
        const updateControlMethods = this.allUpdateControlMethodsforClassModel();
        let rejectedInstances = new SuperSet();

        let instancesOfThisClass;
        if (this.discriminated)
            instancesOfThisClass = instances.filter(instance => instance.__t === undefined);
        else
            instancesOfThisClass = instances.filter(instance => instance instanceof this.Model);

        let updatableInstancesOfThisClass = instancesOfThisClass;

        for (const updateControlMethod of updateControlMethods) {
            updatableInstancesOfThisClass = await ClassModel.asyncFilter(updatableInstancesOfThisClass, async (instance) => {
                return updateControlMethod(instance, ...updateControlMethodParameters);
            });
        }

        updatableInstancesOfThisClass = new SuperSet(updatableInstancesOfThisClass);
        rejectedInstances = (new SuperSet(instancesOfThisClass)).difference(updatableInstancesOfThisClass);

        if (this.isSuperClass()) {
            if (this.discriminated) {
                let instancesByClass = {};
                instancesByClass[this.className] = [];
    
                for (let instance of instances)
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
                        const rejectedSubClassInstances = await subClassModel.updateControlCheckRecursive(instancesByClass[className], ...updateControlMethodParameters);
                        rejectedInstances.addFromIterable(rejectedSubClassInstances);
                    }
                }
            }
            else if (this.subClasses.length) {
                for (let subClass of this.subClasses) {
                    let instancesOfSubClass = instances.filter(instance => {
                        return subClass.isInstanceOfClassOrSubClass(instance);
                    });
    
                    if (instancesOfSubClass.length) {
                        const rejectedSubClassInstances = await subClass.updateControlCheckRecursive(instancesOfSubClass, ...updateControlMethodParameters);
                        rejectedInstances.addFromIterable(rejectedSubClassInstances);
                    }
                }
            }
        }

        return rejectedInstances;
    }

    /* Recursive method to be called by updateControlCheck()
     * Required Parameter instances - Array<instance> : An array of instances of this Class Model to run update control method on.
     * Returns an InstanceSet containing instances which do not pass update control check.
     * }
     */
    async updateControlCheckInstanceSetRecursive(instanceSet, ...updateControlMethodParameters) {
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
                        const rejectedSubClassInstances = await subClassModel.updateControlCheckInstanceSetRecursive(new InstanceSet(subClassModel, instancesByClass[className]), ...updateControlMethodParameters);
                        rejectedInstances.addInstances(rejectedSubClassInstances);
                    }
                }
            }
            else if (this.subClasses.length) {
                for (let subClass of this.subClasses) {
                    let instancesOfSubClass = instanceSet.filterForClassModel(subClass);
    
                    if (!instancesOfSubClass.isEmpty()) {
                        const rejectedSubClassInstances = await subClass.updateControlCheckInstanceSetRecursive(instancesOfSubClass, ...updateControlMethodParameters);
                        rejectedInstances.addFromIterable(rejectedSubClassInstances);
                    }
                }
            }
        }

        return rejectedInstances;
    }

    /* Takes a single instance of the Class Model and returns true if the instance can be updated.
     * Required Parameter - instance : An instance of this Class Model to filter.
     * Rest Parameter - updateControlMethodParameters - an array of parameters used by this ClassModel's update control method.
     * Returns a Promise which resolves to true if the instance can be updated. Otherwise throws an error.
     */
    async updateControlCheckOne(instance, ...updateControlMethodParameters) {
        if (!instance)
            return true;

        return this.updateControlCheck([instance], ...updateControlMethodParameters);
    }

    // Comparison Methods
    
    // This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
    compare(instance1, instance2) {
        var match = true;
        var message = '';
        var schema = this.schema;
        var className = this.className;

        if (!instance1 && !instance2) {
            return {
                match: true,
                message: 'Both instances are null.'
            }
        }
        else if (!instance1) {
            match = false;
            message = 'First instance is null.';
        }
        else if (!instance2) {
            match = false;
            message = 'Second instance is null.';
        }
        else {
            Object.keys(schema).forEach(function(key) {
                if (key != '_id') {
                    if (!Array.isArray(schema[key].type)) {
                        if (instance1[key] != instance2[key]) {
                            match = false;
                            message += className + '.' + key + '\'s do not match.';
                        }
                    }
                    else {
                        if (instance1[key].length != instance2[key].length) {
                            match = false;
                            message += className + '.' + key + '\'s do not match.';
                        }
                        else {
                            for (var i = 0; i < instance1[key].length; i++) {
                                if (instance1[key][i] != instance2[key][i]) {
                                    match = false;
                                    message += className + '.' + key + '\'s do not match.';
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
    
        if (match)
            message = this.className + 's Match';
    
        return {
            match: match, 
            message: message
        };
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
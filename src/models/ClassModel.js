/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./database');
require('@babel/polyfill');

const AllClassModels = [];

class ClassModel {

    constructor(parameters) {
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
        this.abstract = parameters.abstract;
        this.discriminated = parameters.discriminated;
        this.accessControlled = parameters.accessControlled;
        this.accessControlMethod = parameters.accessControlMethod ? parameters.accessControlMethod : undefined;
        this.superClasses = parameters.superClasses ? parameters.superClasses : [];
        this.discriminatorSuperClass = parameters.discriminatorSuperClass;

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
        }
        else {
            if (!this.abstract || (this.abstract && this.discriminated))
                this.Model = mongoose.model(this.className, schemaObject);
        }

        AllClassModels[this.className] = this;
    }

    // Create
    create() {
        if (this.abstract)
            throw new Error('You cannot create an instance of an abstract class.');

        return new this.Model({
            _id: new mongoose.Types.ObjectId
        });
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

    /*
     * Defines what it means for a filed to be set. Valid values that count as 'set' are as follows:
     * boolean: True
     * number: Any value including 0.
     * string: Any thing of type string, excluding an empty string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
     */
    fieldIsSet(instance, key) {
        let schema = this.schema;

        if (Array.isArray(schema[key].type)) {
            if (instance[key].length) {
                return true;
            }
        }
        else if (schema[key].type == Number) {
            if (instance[key] || instance[key] == 0)
                return true;
        }
        else if (schema[key].type == String) {
            if (instance[key])
                return true;
        }
        else {
            if (instance[key]) {
                return true;
            }
        }
        return false;
    }

    // Validation Methods

    // Throws an error if multiple fields with the same mutex have a value.
    mutexValidation(instance) {
        let muti = [];
        let violations = [];
        let message = '';
        let valid = true;
        let classModel = this;
        let schema = classModel.schema;

        Object.keys(schema).forEach(function(key) {
            if (schema[key].mutex && classModel.fieldIsSet(instance, key)) {
                    if (muti.includes(schema[key].mutex)) {
                        violations.push(schema[key].mutex);
                    }
                    else {
                        muti.push(schema[key].mutex);
                    }
                }
        });

        if (violations.length) {
            valid = false;
            message = 'Mutex violations found for instance ' + instance._id + '.';
            Object.keys(schema).forEach(function(key) {
                if (violations.includes(schema[key].mutex) && classModel.fieldIsSet(instance, key)) {
                            message += ' Field ' + key + ' with mutex \'' + schema[key].mutex + '\'.'
                }
            });
        }
        return {
            valid: valid,
            message: message,
        }
    }

    /*
     * Mongoose's built in requirement validation does not cover some use cases, so this method fills in the gaps.
     * This method considers a boolean 'false' value as not set, and an empty array as not set. All other required validations
     * are left to the built in mongoose validation. 
     */

    requiredValidation(instance) {
        let message = '';
        let valid = true;
        let schema = this.schema;
        let classModel = this;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].required) {
                if (Array.isArray(schema[key].type) && !classModel.fieldIsSet(instance, key)) {
                        if (valid) {
                            valid = false;
                        }
                        //message += 'Field "' + key + '" is required, but its value is <' + instance[key] + '>. ';
                        message += classModel.className + ' validation failed: ' + key + ': Path \`' + key + '\` is required.'
                }
                else if (schema[key].type == Boolean && instance[key] == false) {
                    if (valid) {
                        valid = false;
                    }
                    //message += 'Field "' + key + '" is required, but its value is <' + instance[key] + '>. ';
                    message += classModel.className + ' validation failed: ' + key + ': Path \`' + key + '\` is required.'
                }

            }
        });

        return {
            valid: valid,
            message: message,
        }

    }

    requiredGroupValidation(instance) {
        let requiredGroups = [];
        let message = '';
        let valid = true;
        let classModel = this;
        let schema = classModel.schema;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].requiredGroup && !requiredGroups.includes(schema[key].requiredGroup)) {
                requiredGroups.push(schema[key].requiredGroup);
            }
        });

        // Iterate through the instance members to check that at least one member for each required group is set.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].requiredGroup && classModel.fieldIsSet(instance, key)) {
                requiredGroups = requiredGroups.filter(function(value) { return value != schema[key].requiredGroup; });
            }
        });

        if (requiredGroups.length) {
            valid = false;
            message = 'Required Group violations found for requirement group(s): ';
            requiredGroups.forEach(function(requiredGroup) {
                message += ' ' + requiredGroup;
            });
        }
        return {
            valid: valid,
            message: message,
        }
        
    }

    validate(instance) {
        let message = '';
        let valid = true;
        let numberOfMessages = 0;

        let requiredFieldValidation = this.requiredValidation(instance);
        let requiredGroupValidationResult = this.requiredGroupValidation(instance);
        let mutexValidationResult = this.mutexValidation(instance);

        if (requiredFieldValidation.valid == false) {
            numberOfMessages++;
            valid = false;
            message += requiredFieldValidation.message;
        }

        if (requiredGroupValidationResult.valid == false) {
            valid = false;
            if (numberOfMessages) {
                message += ' ';
            }
            numberOfMessages++;
            message += requiredGroupValidationResult.message;
        }

        if (mutexValidationResult.valid == false) {
            valid = false;
            if (numberOfMessages) {
                message += ' ';
            }
            numberOfMessages++;
            message += mutexValidationResult.message;
        }

        let internalValidationError = instance.validateSync();

        if (internalValidationError) {
            valid = false;
            if (numberOfMessages) {
                message += ' ';
            }
            
            numberOfMessages++;
            message += internalValidationError.message;
        }

        if (!valid)
            throw new Error(message);
    }

    // Save
    save(instance) {
        let classModel = this;

        return new Promise(function(resolve, reject) {

            if (!(instance instanceof classModel.Model)) {
                reject(new Error(classModel.className + '.save() called on an instance of a different class.'));
            }
            else {
                classModel.validate(instance);

                instance.save(function(err, saved) {
                    if (err) {
                        // if (errorMessage != null)
                        // 	console.log(errorMessage);
                        reject(err);
                    }
                    else {
                        // if (successMessasge != null)
                        // 	console.log(successMessasge);
    
                        resolve(saved);
                    }
                });
            }
        });
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

    static async saveAllHelper(promises) {
        let savedInstances = [];

        for (let index in promises) {
            savedInstances.push(await promises[index]);
        }

        return savedInstances;
    }

    saveAll(instances) {
        let classModel = this;

        return new Promise(function(resolve, reject) {
            if (instances == null) {
                reject(new Error(classModel.className + '.saveAll(instances): instances cannot be null.'));
            }
            else if (!Array.isArray(instances)) {
                reject(new Error(classModel.className + '.saveAll(instances): instances must be an Array.'));
            }
            else {
                let promises = [];

                instances.forEach(function(instance) {
                    promises.push(classModel.save(instance));
                });
        
                ClassModel.saveAllHelper(promises).then(
                    function(savedInstances) {
                        resolve(savedInstances);
                    },
                    function (error) {
                        reject(error);
                    }
                );
            }
        });
    }

    // Query Methods

    /* Finds an instance of this ClassModel with the given id in the database. 
     * If called on a superclass, will recursively check this ClassModel's collection, and then it's subclasses collections.
     * Parameter id - the Object ID of the instance to find.
     * Returns a promise, which will resolve with the instance with the given id if it can be found, otherwise null.
     */
    async findById(id, ...accessControlMethodParameters) {
        const isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        
        // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error.
        if (this.abstract && !isSuperClass)
            throw new Error('Error in ' + this.className + '.findById(). This class is abstract and non-discriminated, but it has no sub-classes.');

        if (id == undefined)
            return null;

        return this.findOne({
                _id : id
            },
            ...accessControlMethodParameters
        );
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
            const instanceFound = await Model.findOne(queryFilter).exec();
            return this.accessFilterOne(instanceFound, ...accessControlMethodParameters);
        }
        // If this is a non-discriminated super class, we may need to check this classmodel's collection as well,
        //  as well as the subclasses collections.
        if (isSuperClass && !discriminated) {
            let promises = [];

            // If this is a concrete super class, we need to check this ClassModel's own collection.
            if (concrete){
                const foundInstance = await Model.findOne(queryFilter).exec();
                if (foundInstance) 
                    return this.accessFilterOne(foundInstance, ...accessControlMethodParameters);
            }

            // Call findOne on our subclasses as well.
            for (let subClass of subClasses)
                promises.push(subClass.findOne(queryFilter));

            return ClassModel.firstNonNullPromiseResolution(promises);
        }
    }

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
            const foundInstances = await Model.find(queryFilter).exec();
            return this.accessFilter(foundInstances, ...accessControlMethodParameters);

        }
        // If this is a non-discriminated super class, we may need to check this classmodel's collection as well,
        //  as well as the subclasses collections.
        if (isSuperClass && !discriminated) {
            let promises = [];
            let foundInstancesOfThisClass = [];

            // If this is a concrete super class, we need to check this ClassModel's own collection.
            if (concrete){
                foundInstancesOfThisClass = await Model.find(queryFilter).exec();

                if (foundInstancesOfThisClass.length)
                    foundInstancesOfThisClass = await this.accessFilter(foundInstancesOfThisClass, ...accessControlMethodParameters);
            }

            // Call find on our subclasses as well.
            for (let subClass of subClasses)
                promises.push(subClass.find(queryFilter));

            let foundInstances = await ClassModel.allPromiseResultionsTrimmed(promises);
            return foundInstances.concat(foundInstancesOfThisClass);
        }
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
    walk() {
        let schema = this.schema;
        let className = this.className;

        return new Promise((resolve, reject) => {            
            if (arguments.length < 2) {
                reject(new Error(className + '.walk() called with insufficient arguments. Should be walk(instance, relationship, <optional>filter).'));
            }
            else if (!this.isInstanceOfClassOrSubClass(arguments[0])) {
                reject(new Error(className + '.walk(): First argument needs to be an instance of ' + className + '\'s classModel or one of its sub classes.'));
            }
            else if (typeof(arguments[1]) != 'string') {
                reject(new Error(className + '.walk(): Second argument needs to be a String.'));
            }
            else if (!(arguments[1] in schema)) {
                reject(new Error(className + '.walk(): Second argument needs to be a field in ' + className + '\'s schema.'));
            }
            else if (!ClassModel.fieldIsARelationship(schema[arguments[1]])) {
                reject(new Error(className + '.walk(): field "' + arguments[1] + '" is not a relationship.'));
            }
            else if (arguments.length > 2 && typeof(arguments[2] != "object")) {
                reject(new Error(className + '.walk(): Third argument needs to be an object.'));
            }
            else {
                let instance = arguments[0];
                let relationship = arguments[1];
                let filter = (arguments.length > 2) ? arguments[2] : {};
                let relatedClass = AllClassModels[schema[relationship].ref];
                let singular = schema[relationship].type == Schema.Types.ObjectId;

                // If relationship is to a singular instance, use findOne()
                if (singular) {
                    if (instance[relationship] == null) {
                        resolve(null);
                    }
                    else {
                        Object.assign(filter, {
                            _id: instance[relationship],
                        });
                        relatedClass.findOne(filter).then(
                            (relatedInstance) => {
                                resolve(relatedInstance);
                            },
                            (findError) => {
                                reject(findError);
                            }
                        );
                    }
                }
                // If nonsingular, use find()
                else {
                    if (instance[relationship] == null || instance[relationship].length == 0) {
                        resolve([]);
                    }
                    else {
                        Object.assign(filter, {
                            _id: {$in: instance[relationship]}
                        });
    
                        relatedClass.find(filter).then(
                            (relatedInstances) => {
                                resolve(relatedInstances);
                            }
                        );
                    }
                }
            }
        });
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
    async accessFilter(instances, ...accessControlMethodParameters) {
        if (!Array.isArray(instances))
            throw new Error('Incorrect parameters. ' + this.className + '.accessFilter(Array<instance> instances, ...accessControlMethodParameters)');

        // If instances is an empty array, return an empty array.
        if (!instances.length)
            return [];
        
        instances.forEach((instance) => {
            if (!this.isInstanceOfClassOrSubClass(instance))
                throw new Error(this.className + '.accessFilter() called with instances of a different class.');
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
                    let filteredSubClassInstances = await subClass.accessFilter(instancesOfSubClass, ...accessControlMethodParameters);
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
                    let filteredSubClassInstances = await subClassModel.accessFilter(instancesByClass[className], ...accessControlMethodParameters);
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

    /* Takes a single instance of the Class Model. If the instance passes this Class Model's access control method, it is returned,
     *  otherwise, returns null
     * Required Parameter - instance : An array of instances of this Class Model to filter.
     * Rest Parameter - accessControlMethodParameters - an array of parameters used by this ClassModel's access control method.
     * Returns Promise(Instance): The given instance or null.
     */
    async accessFilterOne(instance, ...accessControlMethodParameters) {
        if (!instance)
            return null;

        const filtered = await this.accessFilter([instance], ...accessControlMethodParameters);

        if (filtered.length) 
            return filtered[0];
        else
            return null;
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
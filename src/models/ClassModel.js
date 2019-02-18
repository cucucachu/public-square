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

        this.className = parameters.className;
        this.schema = schema;
        this.subClasses = [];
        this.discriminatorSuperClass = parameters.discriminatorSuperClass;
        this.abstract = parameters.abstract;
        this.discriminated = parameters.discriminated;

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
    static async allPromiseResultions(promises) {
        let results = [];

        for (var index in promises) {
            results = results.concat(await promises[index]);
        }

        return results;
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
            else {classModel.validate(instance);

                instance.save(function(error, saved) {
                    if (error) {
                        reject(error);
                    }
                    else {
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

    findById(id) {
        let concrete = !this.abstract;
        let abstract = this.abstract;
        let discriminated = this.discriminated;
        let isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        let subClasses = this.subClasses;
        let className = this.className;
        let Model = this.Model;

        //console.log(className + '.findById(' + id + '):');

        return new Promise(function(resolve, reject) {
            // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error
            if (abstract && !isSuperClass)
                throw new Error('Error in ' + className + '.findById(). This class is abstract and non-discriminated, but it has no sub-classes.');

            // If this class is a not a super class and is concrete, or if the class is discriminated, then call the built in mongoose query.
            if ((concrete && !isSuperClass) || discriminated) {
                let instance;
                let error;

                //console.log('   Looking directly in my Model.');

                Model.findById(id).exec().then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        reject(error)
                    else {
                        resolve(instance);
                        // if (instance != null)
                        //     console.log('Found the instance in class ' + className + '.');
                    } 
                });
            }

            // If class is a non-discriminated super class, we need to combine the query on this class with the queries for each sub class, 
            //    until we find an instance. If this class is abstract, we do not query for this class directly.
            else if (isSuperClass && !discriminated) {
                if (!abstract) {
                    //console.log('   Checking myself first.');

                    Model.findById(id, function(err, foundInstance) {
                        if (err) {
                            reject(err);
                        }
                        else if (foundInstance) {
                            resolve(foundInstance);
                        }
                        else {
                            //console.log('   Now looking in my subClasses. (' + className + ')');

                            let promises = [];
                            for (var index in subClasses) {
                                promises.push(
                                    subClasses[index].findById(id)
                                );
                            }

                            ClassModel.firstNonNullPromiseResolution(promises).then(
                                function(foundInstance) {
                                    resolve(foundInstance);
                                },
                                function(error) {
                                    reject(error);
                                }
                            );
                        }
                    });
                }
                else {
                    //console.log('   Looking in my subClasses. (' + className + ')');

                    let promises = [];
                    for (var index in subClasses) {
                        promises.push(
                            subClasses[index].findById(id)
                        );
                    }

                    ClassModel.firstNonNullPromiseResolution(promises).then(
                        function(foundInstance) {
                            resolve(foundInstance);
                        },
                        function(error) {
                            reject(error);
                        }
                    );
                }
            }
        });
    }

    findOne() {
        let concrete = !this.abstract;
        let abstract = this.abstract;
        let discriminated = this.discriminated;
        let isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        let subClasses = this.subClasses;
        let className = this.className;
        let Model = this.Model;
        let queryFilter = arguments[0];



        //console.log(className + '.findOne(' + JSON.stringify(queryFilter) + '):');

        return new Promise(function(resolve, reject) {
            // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error
            if (abstract && !isSuperClass)
                throw new Error('Error in ' + className + '.findOne(). This class is abstract and non-discriminated, but it has no sub-classes.');

            // If this class is a not a super class and is concrete, or if the class is discriminated, then call the built in mongoose query.
            if ((concrete && !isSuperClass) || discriminated) {
                let instance;
                let error;

                //console.log('   Looking directly in my Model.');

                Model.findOne(queryFilter).exec().then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        reject(error)
                    else {
                        resolve(instance);
                        // if (instance != null)
                        //     console.log('Found the instance in class ' + className + '.');
                    } 
                });
            }

            // If class is a non-discriminated super class, we need to combine the query on this class with the queries for each sub class, 
            //    until we find an instance. If this class is abstract, we do not query for this class directly.
            else if (isSuperClass && !discriminated) {
                if (!abstract) {
                    //console.log('   Checking myself first.');

                    Model.findOne(queryFilter, function(err, foundInstance) {
                        if (err) {
                            reject(err);
                        }
                        else if (foundInstance) {
                            resolve(foundInstance);
                        }
                        else {
                            //console.log('   Now looking in my subClasses. (' + className + ')');

                            let promises = [];
                            for (var index in subClasses) {
                                promises.push(
                                    subClasses[index].findOne(queryFilter)
                                );
                            }

                            ClassModel.firstNonNullPromiseResolution(promises).then(
                                function(foundInstance) {
                                    resolve(foundInstance);
                                },
                                function(error) {
                                    reject(error);
                                }
                            );
                        }
                    });
                }
                else {
                    //console.log('   Now looking in my subClasses. (' + className + ')');

                    let promises = [];
                    for (var index in subClasses) {
                        promises.push(
                            subClasses[index].findOne(queryFilter)
                        );
                    }

                    ClassModel.firstNonNullPromiseResolution(promises).then(
                        function(foundInstance) {
                            resolve(foundInstance);
                        },
                        function(error) {
                            reject(error);
                        }
                    );
                }
            }
        });
    }

    find() {
        let concrete = !this.abstract;
        let abstract = this.abstract;
        let discriminated = this.discriminated;
        let isSuperClass = (this.subClasses.length > 0 || this.discriminated);
        let subClasses = this.subClasses;
        let className = this.className;
        let Model = this.Model;
        let queryFilter = arguments[0];
        let instances = [];



        //console.log(className + '.find(' + JSON.stringify(queryFilter) + '):');

        return new Promise(function(resolve, reject) {
            // If this class is a non-discriminated abstract class and it doesn't have any sub classes, throw an error
            if (abstract && !isSuperClass)
                throw new Error('Error in ' + className + '.find(). This class is abstract and non-discriminated, but it has no sub-classes.');

            // If this class is a not a super class and is concrete, or if the class is discriminated, then call the built in mongoose query.
            if ((concrete && !isSuperClass) || discriminated) {
                let instances;
                let error;

                //console.log('   Looking directly in my Model.');

                Model.find(queryFilter).exec().then(
                    function(foundInstances) {
                        instances = foundInstances;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        reject(error)
                    else {
                        resolve(instances);
                        // if (instances.length)
                        //     console.log('Found the instances in class ' + className + '.');
                    }
                });
            }

            // If class is a non-discriminated super class, we need to combine the query on this class with the queries for each sub class, 
            //    until we find an instance. If this class is abstract, we do not query for this class directly.
            else if (isSuperClass && !discriminated) {
                let promises = [];

                if (!abstract) {
                    promises.push(Model.find(queryFilter));
                }

                for (var index in subClasses) {
                    promises.push(
                        subClasses[index].find(queryFilter)
                    );
                }

                ClassModel.allPromiseResultions(promises).then(
                    function(foundInstances) {
                        resolve(foundInstances);
                    },
                    function(error) {
                        reject(error);
                    }
                );
            }
        });
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
/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class ClassModel {

    constructor(parameters) {
        if (!parameters.className)
            throw new Error('className is required.');
            
        if (!parameters.schema)
            throw new Error('schema is required.');

        this.className = parameters.className;
        this.schema = parameters.schema;
        this.superClasses = parameters.superClasses;
        this.discriminatorFor = parameters.discriminatorFor;

        let schemaObject = new Schema(this.schema);

        if (!this.superClasses) {
            if (this.discriminatorFor) {
                this.Model = discriminatorFor.Model.discriminator(this.className, this.discriminatorFor)
            }
            else {
                this.Model = mongoose.model(this.className, schemaObject);
            }
        }
    }

    // Create
    create() {
        return new this.Model({
            _id: new mongoose.Types.ObjectId
        })
    }

    // Validation Methods

    /*
     * Defines what it means for a filed to be set. Valid values that count as 'set' are as follows:
     * boolean: True
     * number: Any value including 0.
     * string: Any thing of type string, excluding an empty string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
     */
    static fieldIsSet(classModel, instance, key) {
        let schema = classModel.schema;

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

    // Throws an error if multiple fields with the same mutex have a value.
    static mutexValidation(classModel, instance) {
        let muti = [];
        let violations = [];
        let message = '';
        let valid = true;
        let schema = classModel.schema;

        Object.keys(schema).forEach(function(key) {
            if (schema[key].mutex && ClassModel.fieldIsSet(classModel, instance, key)) {
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
                if (violations.includes(schema[key].mutex) && ClassModel.fieldIsSet(classModel, instance, key)) {
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

    static requiredValidation(classModel, instance) {
        let message = '';
        let valid = true;
        let schema = classModel.schema;


        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].required) {
                if (Array.isArray(schema[key].type) && !ClassModel.fieldIsSet(classModel, instance, key)) {
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

    static requiredGroupValidation(classModel, instance) {
        let requiredGroups = [];
        let message = '';
        let valid = true;
        let schema = classModel.schema;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].requiredGroup && !requiredGroups.includes(schema[key].requiredGroup)) {
                requiredGroups.push(schema[key].requiredGroup);
            }
        });

        // Iterate through the instance members to check that at least one member for each required group is set.
        Object.keys(schema).forEach(function(key) {
            if (schema[key].requiredGroup && ClassModel.fieldIsSet(classModel, instance, key)) {
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

    static validate(classModel, instance) {
        let message = '';
        let valid = true;
        let numberOfMessages = 0;

        let requiredFieldValidation = ClassModel.requiredValidation(classModel, instance);
        let mutexValidationResult = ClassModel.mutexValidation(classModel, instance);
        let requiredGroupValidationResult = ClassModel.requiredGroupValidation(classModel, instance);

        if (requiredFieldValidation.valid == false) {
            numberOfMessages++;
            valid = false;
            message += requiredFieldValidation.message;
        }

        if (mutexValidationResult.valid == false) {
            valid = false;
            if (numberOfMessages) {
                message += ' ';
            }
            numberOfMessages++;
            message += mutexValidationResult.message;
        }

        if (requiredGroupValidationResult.valid == false) {
            valid = false;
            if (numberOfMessages) {
                message += ' ';
            }
            numberOfMessages++;
            message += requiredGroupValidationResult.message;
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
            ClassModel.validate(classModel, instance);

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
        });
    }

    // Query Methods
    findById(id, callback) {
        this.Model.findById(id, callback);
    }


    // Comparison Methods
    
    // This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
    compare(instance1, instance2) {
        var match = true;
        var message = '';

        var schema = this.schema;
        var className = this.className;

        Object.keys(schema).forEach(function(key) {
            if (key != '_id') {
                if (schema[key].type != [Schema.Types.ObjectId]) {
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
                            }
                        }
                    }
                }
            }
        });
    
        if (match)
            message = this.className + 's Match';
    
        return {
            match: match, 
            message: message
        };
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    clear() {
        var model = this.Model;

        return new Promise(function(resolve, reject) {	
		    model.deleteMany({}, function(err) {
                if (err) reject(err);
                else resolve();
            });
	    });
    }
}

module.exports = ClassModel;
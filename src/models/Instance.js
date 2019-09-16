
require('@babel/polyfill');
const mongoose = require('mongoose');
const doc = Symbol('document');

/*
 * Class Instance
 * Provides a wrapper around the native mongoose Document.
 * Holds a mongoose document, as well as the ClassModel of the document, and whether it has been saved previously 
 *   (i.e. is in the database) or deleted.Hides away the native mongoose document methods.
 * Provides save and delete methods to save and delete the underlying document.
 * Passes property set and get calls to properties listed in the related ClassModel schema to the underlying document.
 */
class Instance {

    // Constructs an instance of Instance. 
    // Should only be called by ClassModel methods, not in outside code.
    constructor(classModel, document=null, saved=false) {
        this.constructorValidations(classModel, document, saved);

        this.classModel = classModel;
        this[doc] = document ? document : new classModel.Model({ _id: new mongoose.Types.ObjectId });
        this.saved = saved;
        this.deleted = false;

        const documentProperties = Object.keys(this.classModel.schema).concat(['id', '_id', '__t']);
        const unSettableInstanceProperties = ['classModel', doc, 'id', '_id', '__t']; 
        const instanceMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)); 

        return new Proxy(this, {
            set(trapTarget, key, value, receiver) {
                if (this.deleted) 
                    throw new Error('Illegal Attempt to set a property after instance has been deleted.');

                if (unSettableInstanceProperties.includes(key))
                    throw new Error('Illegal attempt to change the ' + key + ' of an Instance.');

                if (documentProperties.includes(key)) {
                    trapTarget[doc][key] = value;
                    return true;
                }

                return Reflect.set(trapTarget, key, value, receiver);
            },

            get(trapTarget, key, receiver) {
                if (documentProperties.includes(key))
                    return trapTarget[doc][key];

                return Reflect.get(trapTarget, key, receiver);
            },

            has(trapTarget, key) {
                if (documentProperties.includes(key))
                    return key in trapTarget[doc]
                
                return Reflect.has(trapTarget, key);
            },

            deleteProperty(trapTarget, key) {
                if (unSettableInstanceProperties.includes(key) || instanceMethods.includes(key) || Object.keys(trapTarget).includes(key)) 
                    throw new Error('Illegal attempt to delete the ' + key + ' property of an Instance.');

                if (documentProperties.includes(key)) {
                    trapTarget[doc][key] = undefined;
                    return true;
                }
                return Reflect.deleteProperty(trapTarget, key);
            },

            ownKeys(trapTarget) {
                return Reflect.ownKeys(trapTarget).filter(key => typeof key !== 'symbol');
            }
        });
    }

    constructorValidations(classModel, document, saved) {
        if (!classModel) 
            throw new Error('Instance.constructor(), parameter classModel is required.');

        if (!(classModel.className))
            throw new Error('Instance.constructor(), first parameter classModel must be an instance of ClassModel.');
        
        if (classModel.abstract) 
            throw new Error('Instance.constructor(), classModel cannot be abstract.');

        if (document && !(document instanceof classModel.Model))
            throw new Error('Instance.constructor(), given document is not an instance of the given classModel.');

        if (!document && saved)
            throw new Error('Instance.constructor(), if called without a document, parameter saved must be false.');

    }

    toString() {
        return 'Instance of ' + this.classModel.className + '\n' + 
        'saved:   ' + this.saved + '\n' + 
        'deleted: ' + this.deleted + '\n' + 
        'doc:     ' + this[doc]
    }

    assign(object) {
        const documentProperties = Object.keys(this.classModel.schema);
        for (const key in object) {
            if (documentProperties.includes(key))
                this[key] = object[key];
        }
    }

    documentEquals(otherDocument) {
        return this[doc] == otherDocument;
    }

    getDocumentProperty(propertyName) {
        return this[doc][propertyName];
    }

    async walk(relationship, filter = null) {
        return this.classModel.walkInstance(this, relationship, filter);
    }

    // Validation Methods

    /*
     * Defines what it means for a field to be set. Valid values that count as 'set' are as follows:
     * boolean: True
     * number: Any value including 0.
     * string: Any thing of type string, excluding an empty string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
     */
    fieldIsSet(key) {
        let schema = this.classModel.schema;

        if (Array.isArray(schema[key].type))
            return this[key].length ? true : false;

        if (schema[key].type == Number)
            return (this[key] || this[key] == 0);

        if (schema[key].type == String)
            return this[key] ? true : false;
        
        return this[key] ? true : false;
    }

    // Throws an error if multiple fields with the same mutex have a value.
    mutexValidation() {
        let muti = [];
        let violations = [];
        let message = '';
        let classModel = this.classModel;
        let schema = classModel.schema;

        Object.keys(schema).forEach(key => {
            if (schema[key].mutex && this.fieldIsSet(key))
                    if (muti.includes(schema[key].mutex))
                        violations.push(schema[key].mutex);
                    else
                        muti.push(schema[key].mutex);
        });

        if (violations.length) {
            message = 'Mutex violations found for instance ' + this.id + '.';
            Object.keys(schema).forEach(key => {
                if (violations.includes(schema[key].mutex) && this.fieldIsSet(key)) {
                            message += ' Field ' + key + ' with mutex \'' + schema[key].mutex + '\'.'
                }
            });
            throw new Error(message);
        }
    }

    /*
     * Mongoose's built in requirement validation does not cover some use cases, so this method fills in the gaps.
     * This method considers a boolean 'false' value as not set, and an empty array as not set. All other required validations
     * are left to the built in mongoose validation. 
     */

    requiredValidation() {
        let message = '';
        let valid = true;
        let schema = this.classModel.schema;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(key => {
            if (schema[key].required && !this.fieldIsSet(key)) {
                valid = false;
                message += this.classModel.className + ' validation failed: ' + key + ': Path \`' + key + '\` is required.'
            }
        });

        if (!valid)
            throw new Error(message);
    }

    requiredGroupValidation() {
        let requiredGroups = [];
        let message = '';
        let classModel = this.classModel;
        let schema = classModel.schema;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(key => {
            if (schema[key].requiredGroup && !requiredGroups.includes(schema[key].requiredGroup))
                requiredGroups.push(schema[key].requiredGroup);
        });

        // Iterate through the instance members to check that at least one member for each required group is set.
        Object.keys(schema).forEach(key => {
            if (schema[key].requiredGroup && this.fieldIsSet(key))
                requiredGroups = requiredGroups.filter(value => { return value != schema[key].requiredGroup; });
        });

        if (requiredGroups.length) {
            message = 'Required Group violations found for requirement group(s): ';
            requiredGroups.forEach(function(requiredGroup) {
                message += ' ' + requiredGroup;
            });

            throw new Error(message);
        }
    }

    validate() {
        this.requiredValidation();
        this.requiredGroupValidation();
        this.mutexValidation();
        this[doc].validateSync();
    }

    // Update and Delete Methods Methods

    async save(...updateControlMethodParameters) {
        if (this.deleted) 
            throw new Error('instance.save(): You cannot save an instance which has been deleted.');
        
        try {
            this.validate();
            await this.classModel.updateControlCheckInstance(this, ...updateControlMethodParameters);
        }
        catch (error) {
            throw new Error('Caught validation error when attempting to save Instance: ' + error.message);
        }

        await this[doc].save({validateBeforeSave: false});
        this.saved = true;

        return this;
    }

    async saveWithoutValidation() {
        if (this.deleted) 
            throw new Error('instance.save(): You cannot save an instance which has been deleted.');
        await this[doc].save({validateBeforeSave: false});
        this.saved = true;
        return this;
    }

    async delete() {
        if (!this.saved)
            throw new Error('instance.delete(): You cannot delete an instance which hasn\'t been saved yet');

        await this.classModel.delete(this[doc]);
        this.deleted = true;
        return true;
    }

    isInstanceOf(classModel) {
        return classModel.isInstanceOfThisClass(this);
    }

    equals(instance) {
        if (!(instance instanceof Instance))
            throw new Error('instance.equals called with something that is not an instance.');
        if (instance.classModel !== this.classModel)
            return false;
        if (instance.id != this.id)
            return false;
        return true;
    }
}

module.exports = Instance;
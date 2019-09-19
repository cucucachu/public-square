require('@babel/polyfill');
const mongoose = require('mongoose');

const InstanceState = require('./InstanceState');
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
    constructor(classModel, document=null) {
        this.constructorValidations(classModel, document);

        this.classModel = classModel;

        if (document) {
            this._id = document._id;
            this.__t = document.__t;
            this.previousState = new InstanceState(classModel, document);
            this.currentState = new InstanceState(classModel, document);
        }
        else {
            this._id = new mongoose.Types.ObjectId;
            this.__t = classModel.discrinatorSuperClass ? classModel.discriminatorSuperClass.className : undefined;
            this.previousState = null;
            this.currentState = new InstanceState(classModel);
        }

        const attributes = classModel.getAttributes();
        const attributeNames = attributes.map(attribute => attribute.name);
        const singularRelationships = classModel.getSingularRelationships();
        const singularRelationshipNames = singularRelationships.map(relationship => relationship.name);
        const nonSingularRelationships = classModel.getNonSingularRelationships();
        const nonSingularRelationshipNames = nonSingularRelationships.map(relationship => relationship.name);
        const documentProperties = attributeNames.concat(singularRelationshipNames, nonSingularRelationshipNames);
        const unSettableInstanceProperties = ['classModel', 'id', '_id', '__t']; 
        const instanceMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)); 

        return new Proxy(this, {
            set(trapTarget, key, value, receiver) {
                if (trapTarget.deleted) 
                    throw new Error('Illegal Attempt to set a property after instance has been deleted.');

                if (unSettableInstanceProperties.includes(key))
                    throw new Error('Illegal attempt to change the ' + key + ' of an Instance.');

                if (attributeNames.includes(key)) {
                    const attribute = attributes.filter(attribute => attribute.name === key)[0];
                    if (attribute.list && !Array.isArray(value)) {
                        throw new Error('Illegal attempt to set a List Attribute to something other than an Array.');
                    }
                    if (!attribute.list && Array.isArray(value)) {
                        throw new Error('Illegal attempt to set an Attribute to an Array.');
                    }
                    trapTarget.currentState[key] = value;
                    return true;
                }

                if (singularRelationshipNames.includes(key)) {
                    if (!classmodel.valueValidForSingularRelationship(value, key)) 
                        throw new Error('Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.');
                    trapTarget.currentState[key].instance = value;
                    trapTarget.currentState[key].id = value.id;
                    return true;
                }

                if (nonSingularRelationshipNames.inclues(key)) {
                    if (!classmodel.valueValidForNonSingularRelationship(value, key))
                        throw new Error('Illegal attempt to set a non-singular relationship to a value which is not an InstanceSet of the correct ClassModel.');
                    trapTarget.currentState[key].instanceSet = value;
                    trapTarget.currentState[key].ids = value.getInstanceIds();
                    return true;
                }

                return Reflect.set(trapTarget, key, value, receiver);
            },

            get(trapTarget, key, receiver) {
                if (attributeNames.includes(key)) {
                    return trapTarget.currentState[key];
                }

                if (singularRelationshipNames.includes(key)) {
                    if (trapTarget.currentState[key].instance) {
                        return trapTarget.currentState[key].instance;
                    }
                    else if (trapTarget.currentState[key].id) {
                        return trapTarget.currentState[key].id;
                    }
                    else {
                        return null;
                    }
                }

                if (nonSingularRelationshipNames.includes(key)) {
                    if (trapTarget.currentState[key].instanceSet) {
                        return trapTarget.currentState[key].instanceSet;
                    }
                    else if (trapTarget.currentState[key].ids) {
                        return trapTarget.currentState[key].ids;
                    }
                    else {
                        return null;
                    }
                    
                }

                return Reflect.get(trapTarget, key, receiver);
            },

            has(trapTarget, key) {
                if (attributeNames.includes(key)) {
                    const attribute = attributes.filter(attribute => attribute.name === key)[0];
                    if (attribute.list) {
                        return trapTarget.currentState[key].length > 0;
                    }
                    else {
                        return trapTarget.currentState[key] !== null;
                    }
                }

                if (singularRelationshipNames.inclues(key)) {
                    return (trapTarget.currentState[key].id !== null);
                }

                if (nonSingularRelationshipNames.inclues(key)) {
                    return (trapTarget.currentState[key].ids !== null && trapTarget.currentState[key].ids.length);
                }

                return Reflect.has(trapTarget, key);
            },

            deleteProperty(trapTarget, key) {
                if (unSettableInstanceProperties.includes(key) || instanceMethods.includes(key) || Object.keys(trapTarget).includes(key)) {
                    throw new Error('Illegal attempt to delete the ' + key + ' property of an Instance.');
                }

                if (attributeNames.includes(key)) {
                    const attribute = attributes.filter(attribute => attribute.name === key)[0];
                    if (attribute.list) {
                        trapTarget.currentState[key] = [];
                        return true;
                    }
                    else {
                        trapTarget.currentState[key] = null;
                        return true;
                    }
                }

                if (singularRelationshipNames.includes(key)) {
                    trapTarget.currentState[key].instance = null;
                    trapTarget.currentState[key].id = null;
                    return true;
                }

                if (nonSingularRelationshipNames.includes(key)) {
                    trapTarget.currentState[key].instanceSet = null;
                    trapTarget.currentState[key].ids = [];
                    return true;
                }

                return Reflect.deleteProperty(trapTarget, key);
            },

            ownKeys(trapTarget) {
                return Reflect.ownKeys(trapTarget).filter(key => typeof key !== 'symbol');
            }
        });
    }

    // Constructs an instance of Instance. 
    // Should only be called by ClassModel methods, not in outside code.
    constructor2(classModel, document=null, saved=false) {
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

    constructorValidations(classModel, document) {
        if (!classModel) 
            throw new Error('Instance.constructor(), parameter classModel is required.');

        if (!(classModel.className))
            throw new Error('Instance.constructor(), first parameter classModel must be an instance of ClassModel.');
        
        if (classModel.abstract) 
            throw new Error('Instance.constructor(), classModel cannot be abstract.');

        if (document && !(document instanceof classModel.Model))
            throw new Error('Instance.constructor(), given document is not an instance of the given classModel.');

        if (document && !('_id' in document))
            throw new Error('Instance.constructor(), given document does not have an ObjectId.');

    }

    saved() {
        return this.previousState !== null;
    }

    deleted() {
        return this.currentState === null;
    }

    toString() {
        return 'Instance of ' + this.classModel.className + '\n' + 
        'saved:   ' + this.saved() + '\n' + 
        'deleted: ' + this.deleted() + '\n' + 
        'state:     ' + this.currentState
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
    
    /* 
     * Walks a relationship from a given instance of this Class Model, returning the related instance or instances. 
     * @param required Object instance: An instance of this class model
     * @param required String relationship: the key for the desired relationship
     * @param optional Object filter: a filter Object used in the query to filter the returned instances.
     * @return Promise which when resolved returns the related instance if relationship is singular, or an Array of the related 
     *           instances if the relationship is non-singular.
     */ 
    async walk(relationship, filter=null, ...accessControlMethodParameters) {
        if (!relationship)
            throw new Error('instance.walk() called with insufficient arguments. Should be walk(relationship, <optional>filter).');
        
        if (typeof(relationship) != 'string')
            throw new Error('instance.walk(): First argument needs to be a String representing the name of the relationship.');
        
        if (!(relationship in this.classModel.schema))
            throw new Error('instance.walk(): First argument needs to be a relationship property in ' + this.classModel.className + '\'s schema.');
        
        if (!this.classModel.propertyIsARelationship(relationship))
            throw new Error('instance.walk(): property "' + relationship + '" is not a relationship.');
        
        if (filter && typeof(filter) !== "object")
            throw new Error('instance.walk(): Second argument needs to be an object.');
    
        const relatedClass = this.classModel.getRelatedClassModel(relationship);
        const singular = this.classModel.schema[relationship].type == mongoose.Schema.Types.ObjectId;
        filter = filter ? filter : {}

            // If relationship is to a singular instance, use findOne()
        if (singular) {
            if (this[relationship] == null) {
                return null;
            }
            else {
                Object.assign(filter, {
                    _id: this[relationship],
                });
                return relatedClass.findOne(filter, ...accessControlMethodParameters);
            }
        }
        // If nonsingular, use find()
        else {
            if (this[relationship] == null || this[relationship].length == 0) {
                return [];
            }
            else {
                Object.assign(filter, {
                    _id: {$in: this[relationship]}
                });

                return relatedClass.find(filter, ...accessControlMethodParameters);
            }
        }
    }

    // Validation Methods

    /*
     * Defines what it means for a property to be set. Valid values that count as 'set' are as follows:
     * boolean: True
     * number: Any value including 0.
     * string: Any thing of type string, excluding an empty string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
     */
    propertyIsSet(key) {
        let schema = this.classModel.schema;

        if (Array.isArray(schema[key].type))
            return this[key].length ? true : false;

        if (schema[key].type == Number)
            return (this[key] || this[key] == 0);

        if (schema[key].type == String)
            return this[key] ? true : false;
        
        return this[key] ? true : false;
    }

    // Validations
    validate() {
        this.requiredValidation();
        this.requiredGroupValidation();
        this.mutexValidation();
        this[doc].validateSync();
    }

    mutexValidation() {
        let muti = [];
        let violations = [];
        let message = '';
        let classModel = this.classModel;
        let schema = classModel.schema;

        Object.keys(schema).forEach(key => {
            if (schema[key].mutex && this.propertyIsSet(key))
                    if (muti.includes(schema[key].mutex))
                        violations.push(schema[key].mutex);
                    else
                        muti.push(schema[key].mutex);
        });

        if (violations.length) {
            message = 'Mutex violations found for instance ' + this.id + '.';
            Object.keys(schema).forEach(key => {
                if (violations.includes(schema[key].mutex) && this.propertyIsSet(key)) {
                            message += ' Field ' + key + ' with mutex \'' + schema[key].mutex + '\'.'
                }
            });
            throw new Error(message);
        }
    }

    requiredValidation() {
        let message = '';
        let valid = true;
        let schema = this.classModel.schema;

        // Iterate through the schema to find required groups.
        Object.keys(schema).forEach(key => {
            if (schema[key].required && !this.propertyIsSet(key)) {
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
            if (schema[key].requiredGroup && this.propertyIsSet(key))
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

    // Update and Delete Methods Methods

    async save(...updateControlMethodParameters) {
        if (this.deleted) 
            throw new Error('instance.save(): You cannot save an instance which has been deleted.');
        
        try {
            this.validate();
            await this.classModel.updateControlCheck(this, ...updateControlMethodParameters);
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

    isInstance() {
        return true;
    }
}

module.exports = Instance;
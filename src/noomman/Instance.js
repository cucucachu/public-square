const db = require('./database');

const Diffable = require('./Diffable');
const InstanceState = require('./InstanceState');

const stripped = Symbol('stripped');

/*
 * Class Instance
 * Represents a single instance of a specific ClassModel. Provides functionallity for saving, deleting
 *    validation, comparison, auditing, and walking relationships.
 */
class Instance extends Diffable {

    /*
     * constructor(ClassModel, document)
     * Creates an instance of Instance for a given ClassModel.
     * Parameters
     * - classModel - ClassModel - A ClassModel that the created Instance will be an instance of.
     * - document - Object - a mongo document retrieved from a database. This parameter should only be 
     *    used by internal noomman methods.
     * Returns
     * - Instance - the Instance created.
     * Throws
     * - Error - If no ClassModel is provided.
     * - Error - If classModel is not an instance of ClassModel.
     * - Error - If classModel is abstract.
     * - Error - If given document does not have an _id property.
     * - Error - If given document is for an auditable ClassModel but does not have a revision property.
     */
    constructor(classModel, document=null) {
        super();
        this.constructorValidations(classModel, document);

        this.classModel = classModel;

        if (document) {
            this._id = document._id;
            this.__t = document.__t;
            this.revision = document.revision;
            this.previousState = new InstanceState(classModel, document);
            this.currentState = new InstanceState(classModel, document);
        }
        else {
            this._id = db.ObjectId();
            this.__t = classModel.useSuperClassCollection ? classModel.className : undefined;
            this.revision = classModel.auditable ? -1 : undefined;
            this.previousState = null;
            this.currentState = new InstanceState(classModel);
        }

        const attributes = classModel.attributes;
        const attributeNames = attributes.map(attribute => attribute.name);
        const singularRelationships = classModel.relationships.filter(relationship => relationship.singular);
        const singularRelationshipNames = singularRelationships.map(relationship => relationship.name);
        const nonSingularRelationships = classModel.relationships.filter(relationship => !relationship.singular);
        const nonSingularRelationshipNames = nonSingularRelationships.map(relationship => relationship.name);
        const documentProperties = attributeNames.concat(singularRelationshipNames, nonSingularRelationshipNames);
        const unSettableInstanceProperties = ['classModel', 'id', '_id', '__t']; 
        const instanceMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)); 

        for (const nonStaticMethod of Object.keys(this.classModel.nonStaticMethods)) {
            this[nonStaticMethod] = this.classModel.nonStaticMethods[nonStaticMethod];
        }

        return new Proxy(this, {
            set(trapTarget, key, value, receiver) {
                if (trapTarget.deleted()) 
                    throw new Error('Illegal Attempt to set a property after instance has been deleted.');

                if (unSettableInstanceProperties.includes(key))
                    throw new Error('Illegal attempt to change the ' + key + ' of an Instance.');
                
                if (value === undefined)
                    value = null;

                if (attributeNames.includes(key)) {
                    classModel.validateAttribute(key, value);
                    trapTarget.currentState[key] = value;
                    return true;
                }

                if (singularRelationshipNames.includes(key)) {
                    if (!classModel.valueValidForSingularRelationship(value, key)) 
                        throw new Error('Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.');
                    
                    trapTarget.currentState[key] = value;
                    return true;
                }

                if (nonSingularRelationshipNames.includes(key)) {
                    if (!classModel.valueValidForNonSingularRelationship(value, key))
                        throw new Error('Illegal attempt to set a non-singular relationship to a value which is not an InstanceSet of the correct ClassModel.');
                    
                    trapTarget.currentState[key] = value;
                    return true;
                }

                return Reflect.set(trapTarget, key, value, receiver);
            },

            get(trapTarget, key, receiver) {
                if (classModel.relationships.map(relationship => relationship.name).includes(key))
                    return receiver.walk(key);

                if (classModel.relationships.map(relationship => '_' + relationship.name).includes(key))
                    return trapTarget.currentState[key.slice(1)];

                if (attributeNames.includes(key))
                    return trapTarget.currentState[key];

                if (key === 'id')
                    return trapTarget._id.toString();

                return Reflect.get(trapTarget, key, receiver);
            },

            has(trapTarget, key) {
                if (documentProperties.includes(key))
                    return key in trapTarget.currentState;

                return Reflect.has(trapTarget, key);
            },

            deleteProperty(trapTarget, key) {
                if (unSettableInstanceProperties.includes(key) || instanceMethods.includes(key) || Object.keys(trapTarget).includes(key)) {
                    throw new Error('Illegal attempt to delete the ' + key + ' property of an Instance.');
                }
                if (documentProperties.includes(key)){
                    return delete trapTarget.currentState[key];
                }

                return Reflect.deleteProperty(trapTarget, key);
            },

            ownKeys(trapTarget) {
                return Reflect.ownKeys(trapTarget).filter(key => typeof key !== 'symbol');
            }
        });
    }

    /*
     * constructorValidations(ClassModel, document)
     * Runs validations for the constructor method.
     * Parameters
     * - classModel - ClassModel - A ClassModel that the created Instance will be an instance of.
     * - document - Object - a mongo document retrieved from a database. This parameter should only be 
     *    used by internal noomman methods.
     * Throws
     * - Error - If no ClassModel is provided.
     * - Error - If classModel is not an instance of ClassModel.
     * - Error - If classModel is abstract.
     * - Error - If given document does not have an _id property.
     * - Error - If given document is for an auditable ClassModel but does not have a revision property.
     */
    constructorValidations(classModel, document) {
        if (!classModel) 
            throw new Error('Instance.constructor(), parameter classModel is required.');

        if (!(classModel.className))
            throw new Error('Instance.constructor(), first parameter classModel must be an instance of ClassModel.');
        
        if (classModel.abstract) 
            throw new Error('Instance.constructor(), classModel cannot be abstract.');

        if (document && !('_id' in document))
            throw new Error('Instance.constructor(), given document does not have an ObjectId.');

        if (document && classModel.auditable && document.revision === undefined) {
            throw new Error('Instance.constructor(), document of an auditable ClassModel is missing revision.');
        }
    }

    /*
     * toString()
     * Implements the standard toString() behaviour.
     * Returns
     * - String - A string representation of this instance.
     */
    toString() {
        return this.currentState.toString();
    }

    /* 
     * saved()
     * Use to determine if this instance currently exists in the database.
     * Returns
     * - Boolean - True if instance resulted from a database query or if this instance has had a save method
     *    complete successfully. False otherwise.
     */
    saved() {
        return this.previousState !== null;
    }

    /* 
     * deleted()
     * Use to determine if this instance has been deleted from the database.
     * Returns
     * - Boolean - True if instance has been deleted using a delete method. False otherwise.
     */
    deleted() {
        return this.currentState === null;
    }

    /*
     * stripped()
     * Used to determine if this instance has been stripped of sensitive attributes.
     * Returns
     * - Boolean - True if this instance has been stripped of sensitive attributes by calling
     *    stripSensitiveAttributes().
     */
    stripped() {
        return this[stripped];
    }

    /*
     * stripSensitiveAttributes()
     *    Will remove any attributes with property sensitive equal to true from this Instance.
     */
    stripSensitiveAttributes() {
        const sensitiveAttributes = this.classModel.attributes.filter(a => a.sensitive === true);

        if (sensitiveAttributes.length === 0) {
            return;
        }

        for (const attribute of sensitiveAttributes) {
            delete this[attribute.name];
        }

        this[stripped] = true;
    }

    /*
     * assign(object)
     * Will assign the values of any properties on the given object which are attributes or relationships defined on the 
     *    ClassModel of this instance to this Instance. Any other properties on the given object are ignored.
     * Parameters
     * - object - Object - An object containing properties whose values should be assigned to this Instance.
     */
    assign(object) {
        const documentProperties = this.classModel.attributes.concat(this.classModel.relationships).map(property => property.name);
        for (const key in object) {
            if (documentProperties.includes(key))
                this[key] = object[key];
        }
    }
    
    /* 
     * walk(relationshipName, usePreviousState)
     * Walks a relationship from this Instance, returning the related Instance or Instances. 
     * Parameters
     * - relationshipName - String - the name of the relationship to walk.
     * - usePreviousState - Boolean - If true, will walk the previous value of the given relationship for this Instance.
     *    For noomman internal use only.
     * Returns
     * - Promise<Instance | InstanceSet> - The Instance (if relationship is singular) or InstanceSet (if the relationship 
     *    is non-singular) related to this Instance through the given relationship. If relationship is empty, then null will
     *    be returned for singular relationships or an empty InstanceSet will be returned for non-singular relationships.
     * Throws
     * - Error - if no relationshipName is given.
     * - Error - if relationshipName is not a String
     * - Error - if relationshipName does not match any relationship for the ClassModel of this Instance.
     */ 
    async walk(relationshipName, usePreviousState=false) {
        if (!relationshipName)
            throw new Error('instance.walk() called with insufficient arguments. Should be walk(relationshipName, <optional>filter).');
        
        if (typeof(relationshipName) != 'string')
            throw new Error('instance.walk(): First argument needs to be a String representing the name of the relationship.');
        
        if (!this.classModel.attributes.map(attribute => attribute.name).includes(relationshipName) && !this.classModel.relationships.map(relationship => relationship.name).includes(relationshipName))
            throw new Error('instance.walk(): First argument needs to be a relationship property in ' + this.classModel.className + '\'s schema.');

        if (!this.classModel.relationships.map(relationship => relationship.name).includes(relationshipName))
            throw new Error('instance.walk(): property "' + relationshipName + '" is not a relationship.');
    
        
        const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name ===relationshipName)[0];
        const relatedClass = this.classModel.getRelatedClassModel(relationshipName);

        if (usePreviousState && this.previousState === null) {
            if (relationshipDefinition.singular) {
                return null;
            }
            else {
                return [];
            }
        }

        const relationshipCurrentValue = usePreviousState ? this.previousState[relationshipName] : this['_' + relationshipName];
        let walkResult;

        // If relationship is to a singular instance, use findOne()
        if (relationshipDefinition.singular) {
            if (relationshipCurrentValue == null) {
                walkResult = null;
            }
            else {
                if (!usePreviousState) {
                    if (!(relationshipCurrentValue instanceof Instance))
                        this[relationshipName] = await relatedClass.pureFindById(relationshipCurrentValue);
    
                        walkResult = this['_' + relationshipName];
                }
                else {
                    if (!(relationshipCurrentValue instanceof Instance))
                        this.previousState[relationshipName] = await relatedClass.pureFindById(relationshipCurrentValue);
    
                    walkResult = this.previousState[relationshipName];
                }
            }
        }
        // If nonsingular, use find()
        else {
            if (relationshipCurrentValue == null || (Array.isArray(relationshipCurrentValue) && relationshipCurrentValue.length == 0)) {
                walkResult = this.classModel.emptyInstanceSet();
            }
            else {
                if (!usePreviousState) {
                    if (Array.isArray(relationshipCurrentValue)) {
                        this[relationshipName] = await relatedClass.pureFind({
                            _id: {$in: relationshipCurrentValue}
                        });
                    }
                    
                    walkResult = this['_' + relationshipName];
                }
                else {
                    if (Array.isArray(relationshipCurrentValue)) {
                        this.previousState[relationshipName] = await relatedClass.pureFind({
                            _id: {$in: relationshipCurrentValue}
                        });
                    }
                    
                    walkResult = this.previousState[relationshipName];
                }
            }
        }

        return walkResult;
    }

    /*
     * readControlFilter(readControlMethodParameters)
     * Runs applicable readControl methods for this Instance. If each readControl method returns true for 
     *    this Instance, then this Instance is returned, otherwise null is returned.
     * Parameters
     * - readControlMethodParameters - Object - An object containing any parameters that the readControl method(s)
     *    may need.
     * Returns
     * - Promise<Instance> - This Instance if all readControl methods return true, otherwise null.
     */
    async readControlFilter(readControlMethodParameters) {
        return this.classModel.readControlFilterInstance(this, readControlMethodParameters);
    }

    // Validation Methods

    /*
     * propertyIsSet(propertyName)
     * Defines what it means for a property to be set. Valid values that count as 'set' are as follows:
     * boolean: True or False
     * number: Any value including 0.
     * string: Any thing of type string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
     * Parameters
     * - propertyName - String - the name of an attribute or relationship to check.
     * Returns
     * - Boolean - True if the value of the attribute or relationship is considered as set. 
     */
    propertyIsSet(propertyName) {
        const attribute = this.classModel.attributes.filter(attribute => attribute.name === propertyName);
        const singularRelationship = this.classModel.relationships.filter(relationship => relationship.name === propertyName && relationship.singular);
        const nonSingularRelationship = this.classModel.relationships.filter(relationship => relationship.name === propertyName && !relationship.singular);

        if (attribute.length && attribute[0].list) {
            if (!Array.isArray(this[propertyName]) || this[propertyName].length === 0) {
                return false;
            }
        }
        else if (nonSingularRelationship.length) {
            const value = this['_' + propertyName];
            if (Array.isArray(value) && value.length === 0)
                return false;
            if (value !== null && value.size === 0)
                return false;
        }
        else if (singularRelationship.length) {
            if (this['_' + propertyName] === null)
                return false;
        }
        else {
            if (this[propertyName] === null)
                return false;
        }
        return true;
    }

    // Validations

    /* 
     * validate()
     * Throws an error if this instance is invalid for any reason, including violations of 
     *    custom validations, required properties, required groups, or mutexes.
     * Throws
     * - Error - If a required property is not set.
     * - Error - If none of the properties in a required group are set.
     * - Error - If more than one property in a mutex are set.
     * - Error - If a custom validation method from the ClassModel fails.
     */
    async validate() {
        try {
            this.currentState.sync();
            this.requiredValidation();
            this.requiredGroupValidation();
            this.mutexValidation();
            await this.customValidations();
        }
        catch (error) {
            throw new Error(this.id + ': ' + error.message);
        }
    }

    /*
     * mutexValidation()
     * Throws an error if more than one property that is part of a mutex is set.
     * Throws
     * - Error - If more than one property in a mutex are set.
     */
    mutexValidation() {
        const muti = [];
        const violations = [];
        let message = '';
        const properties = this.classModel.attributes.concat(this.classModel.relationships);

        for (const property of properties) {
            if (property.mutex && this.propertyIsSet(property.name)) {
                if (muti.includes(property.mutex)) 
                    violations.push(property.mutex);
                else 
                    muti.push(property.mutex);
            }
        }

        if (violations.length) {
            message = 'Mutex violation(s):';
            for (const property of properties) {
                if (violations.includes(property.mutex) && this.propertyIsSet(property.name)) {
                    message += ' Property "' + property.name + '" with mutex "' + property.mutex + '".';
                }
            }
            throw new Error(message);
        }
    }

    /* 
     * requiredValidation()
     * Throws an error if this instance is invalid due to a required property not being set.
     * Throws
     * - Error - If a required property is not set.
     */
    requiredValidation() {
        const documentProperties = this.classModel.attributes.concat(this.classModel.relationships);
        let message = 'Missing required property(s): ';
        let valid = true;

        for (const documentProperty of documentProperties) {
            if (!documentProperty.required)
                continue;
            if (!this.propertyIsSet(documentProperty.name)) {
                if (!valid)
                    message += ', ';
                valid = false;
                message += '"' + documentProperty.name + '"';
            }
        }

        if (!valid)
            throw new Error(message);
    }

    /* 
     * requiredGroupValidation()
     * Throws an error if none of the properties which share a required group are set.
     * Throws
     * - Error - If none of the properties in a required group are set.
     */
    requiredGroupValidation() {
        let requiredGroups = [];
        let message = '';
        const properties = this.classModel.attributes.concat(this.classModel.relationships);

        for (const property of properties) {
            if (property.requiredGroup && !requiredGroups.includes(property.requiredGroup)) {
                requiredGroups.push(property.requiredGroup);
            }
        }

        for (const property of properties) {
            if (property.requiredGroup && this.propertyIsSet(property.name)) {
                requiredGroups = requiredGroups.filter(group => group !== property.requiredGroup);
            }
        }

        if (requiredGroups.length) {
            message = 'Required Group violations found for requirement group(s):';
            requiredGroups.forEach(function(requiredGroup) {
                message += ' "' + requiredGroup + '"';
            });
            message += '.';

            throw new Error(message);
        }
    }

    /* 
     * customValidations()
     * Throws an error if any custom validation methods defined for the ClassModel of this Instance throws 
     *    an error.
     * Throws
     * - Error - If a custom validation method from the ClassModel fails.
     */
    async customValidations() {
        for (const validationMethod of this.classModel.validations) {
            let result = validationMethod.apply(this);
            if (result instanceof Promise) {
                await result;
            }
        }
    }

    // Update and Delete Methods Methods

    /*
     * save(createControlMethodParameters, updateControlMethodParameters)
     * Saves the current state of this Instance to the database in the proper collection according to its ClassModel.
     * Parameters
     * - createControlMethodParameters - Object - An object containing parameters needed by a createControl method.
     * - updateControlMethodParameters - Object - An object containing parameters needed by a updateControl method.
     * Returns
     * - Promise<Instance> - this Instance, if save is successful.
     * Throws
     * - Error - if this Instance has already been deleted.
     * - Error - if this Instance has been stripped by stripSensitiveAttributes().
     * - Error - if a call to validate() throws an error.
     * - Error - if Instance does not pass createControl or updateControl methods.
     */ 
    async save(createControlMethodParameters, updateControlMethodParameters) {
        if (this.deleted()) {
            throw new Error('instance.save(): You cannot save an instance which has been deleted.');
        }
        
        if (this[stripped]) {
            throw new Error('instance.save(): You cannot save an instance which has been stripped of sensitive attribues.');
        }

        try {
            await this.validate();
        }
        catch (error) {
            throw new Error('Caught validation error when attempting to save Instance: ' + error.message);
        }

        if (this.currentState.equals(this.previousState)) {
            return this;
        }

        if (!this.saved()) {
            await this.classModel.createControlCheckInstance(this, createControlMethodParameters);
            
            if (Object.keys(this.relatedDiffs()).length !== 0) {
                await this.classModel.updateRelatedInstancesForInstance(this);
            }

            await this.classModel.insertOne(this.toDocument());
        }
        else {
            await this.classModel.updateControlCheckInstance(this, updateControlMethodParameters);

            if (Object.keys(this.relatedDiffs()).length !== 0) {
                await this.classModel.updateRelatedInstancesForInstance(this);
            }

            if (this.classModel.auditable) {
                await this.saveAuditEntry();
            }
            await this.classModel.update(this);
        }

        this.revision = this.revision !== undefined ? this.revision + 1 : undefined;
        this.previousState = new InstanceState(this.classModel, this.currentState.toDocument());

        return this;
    }


    /*
     * saveWithoutValidation()
     * Saves the current state of this Instance to the database in the proper collection according to its ClassModel.
     *    Does not do any validation or run crudControl functions, recommended not to be used outside internal 
     *    noomman methods. The purpose is for use in saving multiple instances at once, and any calling method is 
     *    expected to have already run validations and crudControl functions.
     * Returns
     * - Promise<Instance> - this Instance, if save is successful.
     * Throws
     * - Error - if this Instance has already been deleted.
     * - Error - if this Instance has been stripped by stripSensitiveAttributes().
     */ 
    async saveWithoutValidation() {
        if (this.deleted()) {
            throw new Error('instance.save(): You cannot save an instance which has been deleted.');
        }

        if (this[stripped]) {
            throw new Error('instance.save(): You cannot save an instance which has been stripped of sensitive attribues.');
        }

        if (this.currentState.equals(this.previousState))
            return this;

        if (!this.saved()) {
            await this.classModel.insertOne(this.toDocument());
        }
        else {
            if (this.classModel.auditable) {
                await this.saveAuditEntry();
            }
            await this.classModel.update(this);
        }

        this.revision = this.revision !== undefined ? this.revision + 1 : undefined;
        this.previousState = new InstanceState(this.classModel, this.currentState.toDocument());
        return this;
    }

    /*
     * delete(deleteControlMethodParameters) 
     * Deletes this Instance from the database.
     * Parameters
     * - deleteControlMethodParameters - Object - an object containing any parameters needed by a deleteControl method.
     * Returns
     * - Promise<Boolean> - True if Instance is deleted properly.
     * Throws
     * - Error - if this Instance has not yet been saved (i.e. is not in the database).
     * - Error - if deleteControl method returns false for this Instance.
     */
    async delete(deleteControlMethodParameters) {
        if (!this.saved())
            throw new Error('instance.delete(): You cannot delete an instance which hasn\'t been saved yet');

        await this.classModel.deleteControlCheckInstance(this, deleteControlMethodParameters)

        await this.deleteOwnedInstances();

        for (const relationship of this.classModel.relationships.filter(r => r.mirrorRelationship !== undefined)) {
            this[relationship.name] = null;
        }

        await this.classModel.updateRelatedInstancesForInstance(this);

        if (this.classModel.auditable) {
            for (const attribute of this.classModel.attributes) {
                delete this[attribute.name];
            }
            for (const relationship of this.classModel.relationships) {
                delete this[relationship.name];
            }

            await this.saveAuditEntry();
        }

        await this.classModel.delete(this);

        this.currentState = null;

        return true;
    }

    /*
     * deleteOwnedInstances(deleteControlMethodParameters)
     * Deletes any Instances related to this Instance through an 'owns' relationship.
     * Parameters
     * - deleteControlMethodParameters - Object - an object containing any parameters needed by a deleteControl method.
     * Returns 
     * - Promise<Array<Boolean>> - An array of booleans, each of which will be true if all related instances were deleted
     *    successfully.
     * Throws
     * - Error - if a related owned Instance has not yet been saved (i.e. is not in the database).
     * - Error - if deleteControl method returns false for a related owned Instance.
     */
    async deleteOwnedInstances(deleteControlMethodParameters) {
        const ownsRelationships = this.classModel.relationships.filter(r => r.owns === true);
        const deletePromises = [];

        for (const relationship of ownsRelationships) {
            const related = await this[relationship.name];

            if (relationship.singular && related === null) {
                continue;
            }
            if (!relationship.singular && related.isEmpty()) {
                continue;
            }
            deletePromises.push(related.delete(deleteControlMethodParameters));
        }

        if (deletePromises.length === 0) {
            return [];
        }

        return Promise.all(deletePromises);
    }

    /*
     * isInstanceOf(classModel)
     * Determines if this Instance is an Instance of the given ClassModel, or any of its
     *    sub-ClassModels.
     * Parameters
     * - classModel - ClassModel - a ClassModel to check if this is an Instance of.
     * Returns
     * Boolean - True if this Instance is an instance of the given ClassModel, or any of
     *    its sub-ClassModels.
     */
    isInstanceOf(classModel) {
        return classModel.isInstanceOfThisClass(this);
    }

    /*
     * toDocument()
     * Produces an object from this Instance which is exactly what will be stored in the database.
     * Returns
     * - Object - an object that can be inserted into the database.
     */
    toDocument() {
        const document = this.currentState.toDocument();
        document._id = this._id;

        if (this.__t) {
            document.__t = this.__t;
        }

        if (this.revision) {
            document.revision = this.revision + 1;
        }

        return document;
    }

    /*
     * equals(that)
     * Used to compare two instances. Checks that this Instance and the given Instance have
     *    (exactly) the same ClassModel, id, and values for each attribute and relationship.
     * Parameters
     * - that - Instance - an Instance to compare this Instance to.
     * Returns
     * - Boolean - True if the ClassModel, id, and all attributes and relationships are the same
     *    for both Instances, false otherwise.
     * Throws
     * - Error - if 'that' parameter is not an instance of Instance.
     */
    equals(that) {
        if (!(that instanceof Instance))
            throw new Error('instance.equals called with something that is not an instance.');
        if (that.classModel !== this.classModel)
            return false;
        if (that.id != this.id)
            return false;
        if (!this.currentState.equals(that.currentState))
            return false;
        return true;
    }

    /*
     * isInstance()
     * Used to determine if something is an Instance, always returns true.
     * Returns
     * - Boolean - True always.
     */
    isInstance() {
        return true;
    }
}

module.exports = Instance;
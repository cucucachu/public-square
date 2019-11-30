const db = require('./database');

const Diffable = require('./Diffable');
const InstanceState = require('./InstanceState');

const stripped = Symbol('stripped');

/*
 * Class Instance
 * Provides a wrapper around the native mongoose Document.
 * Holds a mongoose document, as well as the ClassModel of the document, and whether it has been saved previously 
 *   (i.e. is in the database) or deleted.Hides away the native mongoose document methods.
 * Provides save and delete methods to save and delete the underlying document.
 * Passes property set and get calls to properties listed in the related ClassModel schema to the underlying document.
 */
class Instance extends Diffable {

    // Constructs an instance of Instance. 
    // Should only be called by ClassModel methods, not in outside code.
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

    toString() {
        return this.currentState.toString();
    }

    saved() {
        return this.previousState !== null;
    }

    deleted() {
        return this.currentState === null;
    }

    stripped() {
        return this[stripped];
    }

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

    assign(object) {
        const documentProperties = this.classModel.attributes.concat(this.classModel.relationships).map(property => property.name);
        for (const key in object) {
            if (documentProperties.includes(key))
                this[key] = object[key];
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
    
    async readControlFilter(readControlMethodParameters) {
        return this.classModel.readControlFilterInstance(this, readControlMethodParameters);
    }

    // Validation Methods

    /*
     * Defines what it means for a property to be set. Valid values that count as 'set' are as follows:
     * boolean: True or False
     * number: Any value including 0.
     * string: Any thing of type string.
     * Array: Any array with a length greater than 0.
     * Object/Relationship: Any Value
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

    async customValidations() {
        for (const validationMethod of this.classModel.validations) {
            let result = validationMethod.apply(this);
            if (result instanceof Promise) {
                await result;
            }
        }
    }

    // Update and Delete Methods Methods

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

    isInstanceOf(classModel) {
        return classModel.isInstanceOfThisClass(this);
    }

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

    isInstance() {
        return true;
    }
}

module.exports = Instance;
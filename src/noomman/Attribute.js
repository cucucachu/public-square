/*
 * Class Attribute
 * Describes the properties and rules/requirements for a single attribute (non-ObjectId/relationship property) 
 *   of a ClassModel. 
 */

class Attribute {

    /* 
     * Attribute constructor
     * Parameters
     * - attributeSchema - An object describing an attribute. 
     * {
     *  name: String (required), 
     *  type: String (required), 
     *  list: Boolean,
     *  required: Boolean,
     *  unique: Boolean,
     *  sensitive: Boolean,
     *  mutex: String,
     *  requiredGroup: String,
     * }
     */
    constructor(attributeSchema) {
        this.constructorValidations(attributeSchema);

        Object.assign(this, attributeSchema);
    }

    /* 
     * constructorValidations(attributeSchema)
     * This method validates that the attributeSchema object passed to the Attribute constructor are valid values.
     * Parameters
     * - attributeSchema - Object - The same object that the constructor() method accepts.
     * Returns
     * - Nothing
     * Throws
     * - Error - When the attributeSchema properties are of incorrect type or conflict with one another.
     */
    constructorValidations(attributeSchema) {
        if (!attributeSchema.name) {
            throw new Error('Attempt to create an attribute without a name.');
        }
        if (typeof(attributeSchema.name) !== 'string') {
            throw new Error('Attempt to create an attribute with name set to something other than a string.');
        }
        if (!attributeSchema.type) {
            throw new Error('Attempt to create an attribute without a type.');
        }
        if (!Attribute.validTypes().includes(attributeSchema.type)) {
            throw new Error('Attempt to create an attribute with an invalid type. Type must be one of the following: ' + Attribute.validTypes().map(type => type.name) + '.');
        }
        if (attributeSchema.list !== undefined && typeof(attributeSchema.list) !== 'boolean') {
            throw new Error('Attempt to create an attribute with list set to something other than a boolean.');
        }
        if (attributeSchema.required !== undefined && typeof(attributeSchema.required) !== 'boolean') {
            throw new Error('Attempt to create an attribute with required set to something other than a boolean.');
        }
        if (attributeSchema.unique !== undefined && typeof(attributeSchema.unique) !== 'boolean') {
            throw new Error('Attempt to create an attribute with unique set to something other than a boolean.');
        }
        if (attributeSchema.sensitive !== undefined && typeof(attributeSchema.sensitive) !== 'boolean') {
            throw new Error('Attempt to create an attribute with sensitive set to something other than a boolean.');
        }
        if (attributeSchema.mutex !== undefined && typeof(attributeSchema.mutex) !== 'string') {
            throw new Error('Attempt to create an attribute with mutex set to something other than a string.');
        }
        if (attributeSchema.requiredGroup !== undefined && typeof(attributeSchema.requiredGroup) !== 'string') {
            throw new Error('Attempt to create an attribute with requiredGroup set to something other than a string.');
        }
    }

    /* 
     * validTypes()
     * This method returns the valid data types for an attribute.
     * Returns
     * - An array containing valid data types for an attribute.
     */
    static validTypes() {
        return [Number, String, Boolean, Date];
    }

    /* 
     * isSet(value)
     * Determines if a given value for this Attribute is considered as 'set'. 
     * A set value is one which is not null, or not an empty array.
     * Parameters
     * - value - any type - a value from an Instance of the ClassModel which holds this Attribute.
     * Returns
     * - True is value is considered set for this Attribute, false otherwise.
     */
    isSet(value) {
        if (this.list) {
            if (!Array.isArray(value) || value.length === 0)
                return false;
        }
        else {
            if (value === null)
                return false;
        }

        return true;
    }

    /* 
     * validate(value)
     * Validates a given value for the type and restrictions defined in this Attribtue.
     * Parameters
     * - value - any type - a value from an Instance of the ClassModel which holds this Attribute.
     * Returns
     * - undefined
     * Throws
     * - Error - when given value is not valid for this Attribute.
     */
    validate(value) {
        if (value === null)
            return true;
            
        if (this.list) {
            if (!Array.isArray(value)) {
                throw new Error('Illegal attempt to set a List Attribute to something other than an Array.');
            }
            for (const item of value) {
                if (!this.validType(item)) {
                    throw new Error('Illegal attempt to set a ' + this.type.name + ' List Attribute to an array containing non-' + this.type.name + ' element(s).');
                }
            }
            return true;
        }
        else {
            if (Array.isArray(value)) {
                throw new Error('Illegal attempt to set an Attribute to an Array.');
            }
            if (!this.validType(value)) {
                throw new Error('Illegal attempt to set a ' + this.type.name + ' Attribute to something other than a ' + this.type.name + '.');
            }
        }
    }

    /* 
     * validType(value)
     * Validates a given value is of correct type for this attribute.
     * Parameters
     * - value - any type - a value from an Instance of the ClassModel which holds this Attribute.
     * Returns 
     * - True if value is of the correct type for this Attribute, False otherwise.
     */
    validType(value) {
        if (value === null)
            return true;

        if (this.type === Boolean && typeof(value) !== 'boolean') {
            return false;
        }
        else if (this.type === String && typeof(value) !== 'string') {
            return false;
        }
        else if (this.type === Number && typeof(value) !== 'number') {
            return false;
        }
        else if (this.type === Date && !(value instanceof Date)) {
            return false;
        }

        return true;
    }
}

module.exports = Attribute;
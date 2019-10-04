require('@babel/polyfill');

class Attribute {

    constructor(attributeSchema) {
        this.constructorValidations(attributeSchema);

        Object.assign(this, attributeSchema);
    }

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

    static validTypes() {
        return [Number, String, Boolean, Date];
    }

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
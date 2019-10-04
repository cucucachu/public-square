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
}

module.exports = Attribute;
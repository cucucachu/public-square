require('@babel/polyfill');

class Relationship {

    constructor(relationshipSchema) {
        this.constructorValidations(relationshipSchema);

        Object.assign(this, relationshipSchema);
    }

    constructorValidations(relationshipSchema) {
        if (!relationshipSchema.name) {
            throw new Error('Attempt to create an relationship without a name.');
        }
        if (typeof(relationshipSchema.name) !== 'string') {
            throw new Error('Attempt to create an relationship with name set to something other than a string.');
        }
        if (!relationshipSchema.toClass) {
            throw new Error('Attempt to create an relationship without a toClass.');
        }
        if (typeof(relationshipSchema.toClass) !== 'string') {
            throw new Error('Attempt to create an relationship with toClass set to something other than a string.');
        }
        if (relationshipSchema.singular === undefined) {
            throw new Error('Attempt to create an relationship with singular undefined.');
        }
        if (relationshipSchema.singular !== undefined && typeof(relationshipSchema.singular) !== 'boolean') {
            throw new Error('Attempt to create an relationship with singular set to something other than a boolean.');
        }
        if (relationshipSchema.required !== undefined && typeof(relationshipSchema.required) !== 'boolean') {
            throw new Error('Attempt to create an relationship with required set to something other than a boolean.');
        }
        if (relationshipSchema.owns !== undefined && typeof(relationshipSchema.owns) !== 'boolean') {
            throw new Error('Attempt to create an relationship with owns set to something other than a boolean.');
        }
        if (relationshipSchema.mirrorRelationship !== undefined && typeof(relationshipSchema.mirrorRelationship) !== 'string') {
            throw new Error('Attempt to create an relationship with mirrorRelationship set to something other than a string.');
        }
        if (relationshipSchema.mutex !== undefined && typeof(relationshipSchema.mutex) !== 'string') {
            throw new Error('Attempt to create an relationship with mutex set to something other than a string.');
        }
        if (relationshipSchema.requiredGroup !== undefined && typeof(relationshipSchema.requiredGroup) !== 'string') {
            throw new Error('Attempt to create an relationship with requiredGroup set to something other than a string.');
        }
    }
}

module.exports = Relationship;
const NoommanErrors = require('./NoommanErrors');

/*
 * Class Relationship
 * Defines a relationship and its properties for a ClassModel.
 */
class Relationship {

    /*
     * constructor(relationshipSchema)
     * Creates a Relationship according to the given schema.
     * Parameters
     * - relationshipSchema - Object - An schema representing the properties and requirements
     *    of this Relationship.
     *    {
     *       name: String (required),
     *       toClass: String (required),
     *       singular: Boolean (required),
     *       required: Boolean,
     *       owns: Boolean,
     *       mirrorRelationship: String,
     *       mutex: String,
     *       requiredGroup: String,
     *    }
     * Returns
     * - Relationship - The Relationship created according to the given relationshipSchema.
     * Throws
     * - NoommanConstructorError - If constructorValidations() throws a NoommanConstructorError.
     */ 
    constructor(relationshipSchema) {
        this.constructorValidations(relationshipSchema);

        Object.assign(this, relationshipSchema);
    }

    /*
     * constructorValidations(relationshipSchema)
     * Verifies that the parameters passed to constructor() are valid.
     * - relationshipSchema - Object - An schema representing the properties and requirements
     *    of this Relationship.
     *    {
     *       name: String (required),
     *       toClass: String (required),
     *       singular: Boolean (required),
     *       required: Boolean,
     *       owns: Boolean,
     *       mirrorRelationship: String,
     *       mutex: String,
     *       requiredGroup: String,
     *    }
     * Throws
     * - NoommanConstructorError - If name property is missing.
     * - NoommanConstructorError - If name property is not a String.
     * - NoommanConstructorError - If toClass property is missing.
     * - NoommanConstructorError - If toClass property is not a String.
     * - NoommanConstructorError - If singular property is missing.
     * - NoommanConstructorError - If singular property is not a Boolean.
     * - NoommanConstructorError - If required property is provided and is not a Boolean.
     * - NoommanConstructorError - If owns property is provided and is not a Boolean.
     * - NoommanConstructorError - If mirrorRelationship property is provided and is not a String.
     * - NoommanConstructorError - If mutex property is provided and is not a String.
     * - NoommanConstructorError - If requiredGroup property is provided and is not a String.
     */ 
    constructorValidations(relationshipSchema) {
        if (!relationshipSchema.name) {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship without a name.');
        }
        if (typeof(relationshipSchema.name) !== 'string') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with name set to something other than a string.');
        }
        if (!relationshipSchema.toClass) {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship without a toClass.');
        }
        if (typeof(relationshipSchema.toClass) !== 'string') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with toClass set to something other than a string.');
        }
        if (relationshipSchema.singular === undefined) {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with singular undefined.');
        }
        if (relationshipSchema.singular !== undefined && typeof(relationshipSchema.singular) !== 'boolean') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with singular set to something other than a boolean.');
        }
        if (relationshipSchema.required !== undefined && typeof(relationshipSchema.required) !== 'boolean') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with required set to something other than a boolean.');
        }
        if (relationshipSchema.owns !== undefined && typeof(relationshipSchema.owns) !== 'boolean') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with owns set to something other than a boolean.');
        }
        if (relationshipSchema.mirrorRelationship !== undefined && typeof(relationshipSchema.mirrorRelationship) !== 'string') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with mirrorRelationship set to something other than a string.');
        }
        if (relationshipSchema.mutex !== undefined && typeof(relationshipSchema.mutex) !== 'string') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with mutex set to something other than a string.');
        }
        if (relationshipSchema.requiredGroup !== undefined && typeof(relationshipSchema.requiredGroup) !== 'string') {
            throw new NoommanErrors.NoommanConstructorError('Attempt to create an relationship with requiredGroup set to something other than a string.');
        }
    }
}

module.exports = Relationship;
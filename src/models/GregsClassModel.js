/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*
 * Gregs Class Model
 * Class
 * Constructor takes a parameters object.
 * 
 * Gregs Class Model has fields: 
 *  className - string
 *  schema - object
 *  subClasses - array of GregsClassModels
 *  discriminatorSuperClass - GregsClassModel
 *  abstract - boolean
 *  discriminated - boolean
 *  Model - Mongoose Model
 */
class GregsClassModel {

    /* Constructor Error Messages
     *
     * Error Messages:
     *   className is required.
     *   schema is required.
     *   If superClasses is set, it must be an Array.
     *   If superClasses is set, it cannot be an empty Array.
     *   If discriminatorSuperClass is set, it can only be a single class.
     *   A ClassModel cannot have both superClasses and discriminatorSuperClass.
     *   If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.
     *   If a class is set as a superClass, that class cannot have its "discriminated" field set to true.
     *   Sub class schema cannot contain the same field names as a super class schema.
     *   A discriminator sub class cannot be abstract.
     *   A sub class of a discriminated super class cannot be discriminated.
     *   A class cannot be a sub class of a sub class of a discriminated class.
     */
    constructor(parameters) {
    }

    // Create
    // Returns a new instance of this model using 'new this.Model()' and sets the (built in) _id attribute to a new mongoose.Types.ObjectId
    create() {
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
    fieldIsSet(instance, key) {
    }

    // Throws an error if multiple fields with the same mutex have a value.
    mutexValidation(instance) {
    }

    /*
     * Mongoose's built in requirement validation does not cover some use cases, so this method fills in the gaps.
     * This method considers a boolean 'false' value as not set, and an empty array as not set. All other required validations
     * are left to the built in mongoose validation. 
     */

    requiredValidation(instance) {

    }
    
    /* 
     *  Validates that at least one of the fields marked with the same required group value is set, according to the fieldIsSet method.
     */
    requiredGroupValidation(instance) {
        
    }
    
    /*
     *  Calls both the built in mongoose validation, and the custom validation functions above. Combines any validation errors into a single error to be thrown.
     */

    validate(instance) {
    }

    // Save
    // Returns a promise. First calls validate on the given instance, using the this Class Model. If validation doesn't throw an error, then
    //   we call the built in mongoose save function instance.save().
    save(instance) {
    }

    // Query Methods
    findById(id) {
    }


    // Comparison Methods
    
    // This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
    // Loop throw each key in the schema, and read its type. Then, depending on the type, verify if the field values of the two instances are
    // equal. For each field that does not match, add to a return message what field did not match. At the end return an object with two fields,
    // the first is a boolean called match, and should be true if each field matched. The second is a message, which, if any fields don't match
    // list the fields that do not match.
    compare(instance1, instance2) {
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    // This returns a promise. It calls the build in method deleteMany(), which takes an object defining query criteria. Pass that method an empty
    // object so that it deletes all instances in the collection.
    clear() {
    }
}

module.exports = GregsClassModel;
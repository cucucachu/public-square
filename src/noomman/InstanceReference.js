const NoommanErrors = require('./NoommanErrors');

/*
 * Class InstanceReference
 * Used by InstanceState to hold the value of a singular relationship. This class helps the processing
 *    and storing of singular relationships, since relationships will have an ObjectId as a value when 
 *    retrieved from the database, and an Instance as a value when the relationship is set by a user 
 *    or populated by calling Instance.walk().
 */
class InstanceReference {

    /*
     * constructor()
     * Creates a new instance of InstanceReference.
     * Returns
     * - InstanceReference - The InstanceReference created.
     */
    constructor() {
        this._id = null;
        this.instance = null;

        return new Proxy(this, {
            get(trapTarget, key, value) {
                if (key === 'id') {
                    return trapTarget._id !== null ? trapTarget._id.toHexString() : null;;
                }
                return Reflect.get(trapTarget, key, value)
            }
        });
    }

    /*
     * equals(that)
     * Used to compare two InstanceReferences. InstanceReferences are equal if they have
     *    the same id property.
     * Parameters
     * - that - InstanceReference - Another InstanceReference to compare against.
     * Returns
     * - Boolean - True if this InstanceReference's id is the same as the given InstanceReference's id.
     */
    equals(that) {
        return this.id === that.id;
    }

    /*
     * isEmpty()
     * Determines whether this is InstanceReference is set or empty.
     * Returns
     * - Boolean - True if this InstanceReference has the _id property set to a non-null value.
     */
    isEmpty() {
        return this._id === null;
    }

    /*
     * diff(that)
     * Creates a diff object based on the value of this InstanceReference as compared to the
     *    given InstanceReference.
     * Parameters
     * - that - InstanceReference - Another InstanceReference to compare against.
     * Returns
     * - Object - A diff object in the format of a mongo update operation object.
     */
    diff(that) {
        if (that === null) {
            return {
                $set: this._id,
            }
        }
        else if (this.equals(that)) {
            return {};
        }
        else if (this.isEmpty() && !that.isEmpty()) {
            return {
                $unset: that._id,
            }
        }
        else {
            return {
                $set: this._id,
            }
        }

    }

}

module.exports = InstanceReference;
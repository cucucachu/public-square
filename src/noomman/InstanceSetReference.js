const SuperSet = require('./SuperSet');

/*
 * class InstanceSetReference
 * Used by InstanceState to hold the value of a non-singular relationship. This class helps the processing
 *    and storing of non-singular relationships, since relationships will have an array of ObjectIds as a value when 
 *    retrieved from the database, and an InstanceSet as a value when the relationship is set by a user 
 *    or populated by calling Instance.walk().
 */
class InstanceSetReference {

    /*
     * constructor()
     * Creates a new instance of InstanceSetReference.
     */
    constructor() {
        this._ids = [];
        this.instanceSet = null;

        return new Proxy(this, {
            get(trapTarget, key, value) {
                trapTarget.sync();
                if (key === 'ids') {
                    return trapTarget._ids != null ? trapTarget._ids.map(id => id.toHexString()) : [];
                }
                return Reflect.get(trapTarget, key, value)
            }
        });
    }

    /*
     * sync()
     * Syncs the value of the _ids array to match the value of the ids from the InstanceSet.
     */
    sync() {
        if (this.instanceSet) {
            this._ids = this.instanceSet.map(instance => instance._id);
        }
    }

    /*
     * equals(that)
     * Used to compare two InstanceSetReferences. InstanceSetReferences are equal if they have
     *    exactly the same ids (regardless of order).
     * Parameters
     * - that - InstanceSetReference - Another InstanceSetReference to compare against.
     * Returns
     * - Boolean - True if this InstanceReference's ids are the same as the given InstanceReference's ids.
     */
    equals(that) {
        if (that === null)
            return false;

        this.sync();
        that.sync();
        if ((!this._ids && that._ids) || (this._ids && !that._ids))
            return false;

        if (!this._ids && !that._ids)
            return true;

        if (this._ids.length != that._ids.length)
            return false;

        if (this._ids.length == 0 && that._ids.length == 0)
            return true;

        for (const id of this.ids) {
            if (!that.ids.includes(id))
                return false;
        }
        return true;
    }

    /*
     * isEmpty()
     * Determines if this InstanceSetReference is empty, i.e. it contains no ids, or it constains an 
     *    InstanceSet which is empty.
     * Returns
     * - Boolean - true if this InstanceSetReference contains no ids, or it constains an 
     *    InstanceSet which is empty.
     */
    isEmpty() {
        this.sync();
        return this._ids.length === 0;
    }

    /*
     * diff(that)
     * Creates a diff object based on the value of this InstanceSetReference as compared to the
     *    given InstanceSetReference.
     * Parameters
     * - that - InstanceSetReference - Another InstanceSetReference to compare against.
     * Returns
     * - Object - a diff object in the format of a mongo update operation object.
     */
    diff(that) {
        if (that === null) {
            if (!this.isEmpty()) {
                return {
                    $set: this._ids,
                }
            }
            else {
                return {};
            }
        }

        this.sync();
        that.sync();

        if (this.equals(that)) {
            return {};
        }
        else if (!this.isEmpty() && that.isEmpty()) {
            return {
                $set: this._ids,
            }
        }
        else if (this.isEmpty() && !that.isEmpty()) {
            return {
                $unset: that._ids,
            }
        }
        else {
            const diffObject = {};
            const thisSet = new SuperSet(this._ids);
            const thatSet = new SuperSet(that._ids);

            const toInsert = [...thisSet.difference(thatSet)];
            const toRemove = [...thatSet.difference(thisSet)];

            if (toInsert.length && !toRemove.length) {
                diffObject.$addToSet = toInsert;
            }
            else if (toRemove.length && !toInsert.length) {
                diffObject.$pull = toRemove;
            }
            else {
                diffObject.$set = this._ids;
            }
            return diffObject;            
        }
    }

    /*
     * splitDiff(that)
     * Creates a diff object based on the value of this InstanceSetReference as compared to the
     *    given InstanceSetReference. Similar to diff() except that this method will split 
     *    changes accross '$addToSet' and '$pull' operations, instead of combining them into a
     *    single '$set' operation. 
     * Parameters
     * - that - InstanceSetReference - Another InstanceSetReference to compare against.
     * Returns
     * - Object - a diff object in the format of a mongo update operation object, except that 
     *    changes may be in both '$addToSet' and '$pull' operations.
     */
    splitDiff(that) {
        if (that === null) {
            if (!this.isEmpty()) {
                return {
                    $set: this._ids,
                }
            }
            else {
                return {};
            }
        }

        this.sync();
        that.sync();

        if (this.equals(that)) {
            return {};
        }
        else if (!this.isEmpty() && that.isEmpty()) {
            return {
                $set: this._ids,
            }
        }
        else if (this.isEmpty() && !that.isEmpty()) {
            return {
                $unset: that._ids,
            }
        }
        else {
            const diffObject = {};
            const thisSet = new SuperSet(this._ids);
            const thatSet = new SuperSet(that._ids);

            const toInsert = [...thisSet.difference(thatSet)];
            const toRemove = [...thatSet.difference(thisSet)];

            if (toInsert.length) {
                diffObject.$addToSet = toInsert;
            }
            if (toRemove.length) {
                diffObject.$pull = toRemove;
            }
            return diffObject;            
        }
        
    }

}

module.exports = InstanceSetReference;
const SuperSet = require('./SuperSet');

class InstanceSetReference {

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

    sync() {
        if (this.instanceSet) {
            this._ids = this.instanceSet.map(instance => instance._id);
        }
    }

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

    isEmpty() {
        this.sync();
        return this._ids.length === 0;
    }

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
            const diffObject = {}
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

}

module.exports = InstanceSetReference;
require('@babel/polyfill');

const SuperSet = require('./SuperSet');

class InstanceSetReference {

    constructor() {
        this._ids = [];
        this.instanceSet = null;

        return new Proxy(this, {
            get(trapTarget, key, value) {
                if (key === 'ids') {
                    return trapTarget._ids != null ? trapTarget._ids.map(id => id.toHexString()) : [];
                }
                return Reflect.get(trapTarget, key, value)
            }
        });
    }

    equals(that) {
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
        return this._ids.length === 0;
    }

    diff(that) {
        if (this.isEmpty() && that.isEmpty()) {
            return {};
        }
        if (!this.isEmpty() && that.isEmpty()) {
            return {
                add: this._ids,
            }
        }
        if (this.isEmpty() && !that.isEmpty()) {
            return {
                remove: that._ids,
            }
        }
        
        const thisSet = new SuperSet(this._ids);
        const thatSet = new SuperSet(that._ids);

        if (thisSet.equals(thatSet))
            return {};

        const toInsert = [...thisSet.difference(thatSet)];
        const toRemove = [...thatSet.difference(thisSet)];

        return {
            update: {
                value: this._ids,
                previous: that._ids,
                insert: [...toInsert],
                remove: [...toRemove],
            }
        }
    }

}

module.exports = InstanceSetReference;
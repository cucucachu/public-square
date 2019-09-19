require('@babel/polyfill');

const SuperSet = require('./SuperSet');

class InstanceSetReference {

    constructor() {
        this.ids = [];
        this.instanceSet = null;
    }

    equals(that) {
        if ((!this.ids && that.ids) || (this.ids && !that.ids))
            return false;

        if (!this.ids && !that.ids)
            return true;

        if (this.ids.length != that.ids.length)
            return false;

        if (this.ids.length == 0 && that.ids.length == 0)
            return true;

        for (const id of this.ids) {
            if (!that.ids.includes(id))
                return false;
        }
        return true;
    }

    isEmpty() {
        return this.ids.length === 0;
    }

    diff(that) {
        if (this.isEmpty() && that.isEmpty()) {
            return {};
        }
        if (!this.isEmpty() && that.isEmpty()) {
            return {
                add: this.ids,
            }
        }
        if (this.isEmpty() && !that.isEmpty()) {
            return {
                remove: that.ids,
            }
        }
        
        const thisSet = new SuperSet(this.ids);
        const thatSet = new SuperSet(that.ids);

        if (thisSet.equals(thatSet))
            return {};

        const toInsert = [...thisSet.difference(thatSet)];
        const toRemove = [...thatSet.difference(thisSet)];

        return {
            update: {
                value: this.ids,
                previous: that.ids,
                insert: [...toInsert],
                remove: [...toRemove],
            }
        }
    }

}

module.exports = InstanceSetReference;
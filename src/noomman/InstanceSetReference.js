require('@babel/polyfill');

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

}

module.exports = InstanceSetReference;
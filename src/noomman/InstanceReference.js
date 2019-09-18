require('@babel/polyfill');

class InstanceReference {

    constructor() {
        this.id = null;
        this.instance = null;
    }

    equals(that) {
        return this.id === that.id;
    }

    isEmpty() {
        return this.id === null;
    }

    diff(that) {
        if (this.isEmpty() && that.isEmpty()) {
            return {};
        }
        if (this.equals(that)) {
            return {};
        }
        if (!this.isEmpty() && that.isEmpty()) {
            return {
                add: this.id,
            }
        }
        if (this.isEmpty() && !that.isEmpty()) {
            return {
                remove: that.id,
            }
        }
        return {
            update: {
                value: this.id,
                previous: that.id,
                insert: this.id,
                remove: that.id,
            }
        }
    }

}

module.exports = InstanceReference;
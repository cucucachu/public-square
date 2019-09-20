require('@babel/polyfill');

class InstanceReference {

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

    equals(that) {
        return this.id === that.id;
    }

    isEmpty() {
        return this._id === null;
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
                add: this._id,
            }
        }
        if (this.isEmpty() && !that.isEmpty()) {
            return {
                remove: that._id,
            }
        }
        return {
            update: {
                value: this._id,
                previous: that._id,
                insert: this._id,
                remove: that._id,
            }
        }
    }

}

module.exports = InstanceReference;
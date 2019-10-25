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
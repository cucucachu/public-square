require('@babel/polyfill');

class InstanceReference {

    constructor() {
        this.id = null;
        this.instance = null;
    }

    equals(that) {
        return this.id === that.id;
    }

}

module.exports = InstanceReference;
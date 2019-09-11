require('@babel/polyfill');

const ClassModel = require('./ClassModel');
const Instance = require('./Instance');
const SuperSet = require('./SuperSet');

class InstanceSet extends SuperSet {

    constructor(classModel, instances) {
        InstanceSet.constructorValidations(classModel, instances);
        super(instances);
        this.classModel = classModel;
    }

    static constructorValidations(classModel, instances) {
        if (!(classModel instanceof ClassModel))
            throw new Error('InstanceSet.constructor() first argument must be an instance of ClassModel.');
        if (instances)
            InstanceSet.addInstancesValidations(classModel, instances);
    }

    static addInstancesValidations(classModel, instances) {
        if (!(typeof instances[Symbol.iterator] === 'function'))
            throw new Error('instances argument must be iterable.');

        instances.forEach(instance => {
            if (!(instance instanceof Instance))
                throw new Error('Illegal attempt to add something other than Instances to an InstanceSet.');
            if (!instance.isInstanceOf(classModel))
                throw new Error('Illegal attempt to add instances of a different class to an InstanceSet.');
        });
    }

    // Set Math
    equals(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.equals() argument is not an InstanceSet.');
        
        if (instanceSet.size != this.size)
            return false;

        if (this.size == 0 && instanceSet.size == 0)
            return true;

        const myIds = this.getInstanceIds();
        const otherIds = instanceSet.getInstanceIds();

        for (const id of otherIds) {
            if (!(myIds.includes(id)))
                return false;
        }

        return true;
    }

    difference(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.difference() argument is not an InstanceSet.');

        return new InstanceSet(this.classModel, [...this].filter(x => !instanceSet.has(x)));
    }

    union(instanceSet) {
        let combination = new InstanceSet();

        [...this, ...instanceSet].forEach(instance => combination.add(instance));
        return combination;
    }

    static setsDifference(setA, setB) {
        return new InstanceSet(setA.classModel, [...setA].filter(x => !setB.has(x)));
    }

    // forEach, Map, Reduce

    mapToInstanceSet(callback) {
        return new InstanceSet(this.ClassModel, [...this].map(callback));
    }

    // Adding elements
    addFromIterable(iterable) {
        //Check if iterable is really iterable
        if (iterable == null)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new Error('InstanceSet.addFromIterable() called with an argument which is not iterable.');

        InstanceSet.addInstanceValidations(this.classModel, iterable);

        for (const instance of iterable)
            this.add(instance);
    }

    getInstanceIds() {
        return this.map(instance => instance.id);
    }

}

module.exports = InstanceSet;
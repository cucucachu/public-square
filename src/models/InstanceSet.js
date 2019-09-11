require('@babel/polyfill');

const ClassModel = require('./ClassModel');
const Instance = require('./Instance');
const SuperSet = require('./SuperSet');

class InstanceSet extends SuperSet {

    constructor(classModel, instances) {
        InstanceSet.constructorValidations(classModel, instances);
        super(instances);
    }

    static constructorValidations(classModel, instances) {
        if (!(classModel instanceof ClassModel))
            throw new Error('InstanceSet.constructor() first argument must be an instance of ClassModel.');
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
        
        return super.equals(instanceSet);
    }

    difference(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.difference() argument is not an InstanceSet.');

        return new InstanceSet([...this].filter(x => !instanceSet.has(x)));
    }

    union(instanceSet) {
        let combination = new InstanceSet();

        [...this, ...instanceSet].forEach(instance => combination.add(instance));
        return combination;
    }

    static setsDifference(setA, setB) {
        return new InstanceSet([...setA].filter(x => !setB.has(x)));
    }

    // forEach, Map, Reduce

    map(callback) {
        return new InstanceSet([...this].map(callback));
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

}

module.exports = InstanceSet;
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
                throw new Error('Illegal attempt to add something other than instances to an InstanceSet.');
            if (!instance.isInstanceOf(classModel))
                throw new Error('Illegal attempt to add instances of a different class to an InstanceSet.');
        });
    }

    // Adding Instances to Set

    add(instance) {
        if (!instance)
            return;
        
        // This check is necessary because the Set constructor will call add(), and at that time, 
        //  this.classModel is undefined.
        if (this.classModel)
            InstanceSet.addInstancesValidations(this.classModel, [instance]);

        super.add(instance);
    }

    addFromIterable(iterable) {
        this.addInstances(iterable);
    }

    addInstances(instances) {
        //Check if iterable is really iterable
        if (!instances)
            return;

        InstanceSet.addInstancesValidations(this.classModel, instances);

        for (const instance of instances)
            super.add(instance);
    }

    // Override super method.
    removeFromIterable(instances) {
        this.removeInstances(instances);
    }

    // Removing Instances from Set
    removeInstances(instances) {
        if (!instances || !this.size)
            return;

        if (!(typeof instances[Symbol.iterator] === 'function'))
            throw new Error('instances argument must be iterable.');
        
        instances.forEach(instance => this.remove(instance));
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
        if (!instanceSet)
            return new InstanceSet(this.classModel, this);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('instanceSet.union() called with argument which is not an InstanceSet');
    
        let combination = new InstanceSet(this.classModel);

        [...this, ...instanceSet].forEach(instance => combination.add(instance));
        return combination;
    }

    static setsDifference(setA, setB) {
        throw new Error('InstanceSet.setsDifference() is not implemented.');
    }

    // forEach, Map, Reduce

    mapToInstanceSet(callback) {
        return new InstanceSet(this.classModel, [...this].map(callback));
    }

    getInstanceIds() {
        return this.map(instance => instance.id);
    }

}

module.exports = InstanceSet;
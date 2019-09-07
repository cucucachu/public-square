require('@babel/polyfill');

class InstanceSet extends Set {
    constructor(iterable) {
        super(iterable);
    }

    toString() {
        return [...this].toString();
    }

    // Set Math
    equals(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.equals() argument is not an InstanceSet.');
        
        if (this.size != instanceSet.size)
            return false;

        if (this.size == 0 && instanceSet.size == 0)
            return true;

        const equalSet = [...this].reduce((x, y) => {
            return new Set([...x, instanceSet.has(y)]);
        }, []);

        return !equalSet.has(false);
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

    static setsEqual(setA, setB) {
        if (setA.size != setB.size) return false;

        const equalSet = [...setA].reduce((x, y) => {
            return new Set([...x, setB.has(y)]);
        }, []);

        return !equalSet.has(false);
    }

    static setsDifference(setA, setB) {
        return new Set([...setA].filter(x => !setB.has(x)));
    }

    // forEach, Map, Reduce

    forEach(callback) {
        [...this].forEach(callback);
    }

    map(callback) {
        return new InstanceSet([...this].map(callback));
    }

    mapToArray(callback) {
        return [...this].map(callback);
    }

    reduce(callback, initialValue=undefined) {
        if (initialValue != undefined)
            return [...this].reduce(callback, initialValue);
        return [...this].reduce(callback);
    }

    // Adding elements
    addFromIterable(iterable) {
        //Check if iterable is really iterable
        if (iterable == null)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new Error('InstanceSet.addFromIterable() called with an argument which is not iterable.');

        for (const instance of iterable)
            this.add(instance);
    }

    remove(instance) {
        if (instance == null)
            return;

        this.delete(instance);
    }

    // Removing elements
    removeFromIterable(iterable) {
        //Check if iterable is really iterable
        if (iterable == null)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new Error('InstanceSet.removeFromIterable() called with an argument which is not iterable.');
        
        if (!this.size)
            return;

        for (const instance of iterable)
            this.remove(instance);
    }

    isEmpty() {
        return this.size == 0;
    }


}

module.exports = InstanceSet;
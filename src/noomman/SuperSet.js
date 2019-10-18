require('@babel/polyfill');

class SuperSet extends Set {
    constructor(iterable) {
        super(iterable);
    }

    toString() {
        return [...this].toString();
    }

    // Set Math
    equals(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new Error('SuperSet.equals() argument is not an SuperSet.');
        
        if (this.size != superSet.size)
            return false;

        if (this.size == 0 && superSet.size == 0)
            return true;

        const equalSet = [...this].reduce((x, y) => {
            return new Set([...x, superSet.has(y)]);
        }, []);

        return !equalSet.has(false);
    }

    difference(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new Error('SuperSet.difference() argument is not an SuperSet.');

        return new SuperSet([...this].filter(x => !superSet.has(x)));
    }

    intersection(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new Error('SuperSet.difference() argument is not an SuperSet.');

        return new SuperSet([...this].filter(x => superSet.has(x)));
    }

    union(superSet) {
        let combination = new SuperSet();

        [...this, ...superSet].forEach(instance => combination.add(instance));
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

    mapToSuperSet(callback) {
        return new SuperSet([...this].map(callback));
    }

    map(callback) {
        return [...this].map(callback);
    }

    reduce(callback, initialValue=undefined) {
        if (initialValue != undefined)
            return [...this].reduce(callback, initialValue);
        return [...this].reduce(callback);
    }

    filter(callback) {
        return [...this].filter(callback);
    }

    toArray() {
        return [...this];
    }

    // Adding elements
    addFromIterable(iterable) {
        //Check if iterable is really iterable
        if (!iterable)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new Error('SuperSet.addFromIterable() called with an argument which is not iterable.');

        for (const item of iterable)
            this.add(item);
    }

    remove(element) {
        super.delete(element);
    }

    // Removing elements
    removeFromIterable(iterable) {
        //Check if iterable is really iterable
        if (!iterable)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new Error('SuperSet.removeFromIterable() called with an argument which is not iterable.');
        
        if (!this.size)
            return;

        for (const instance of iterable)
            this.remove(instance);
    }

    isEmpty() {
        return this.size == 0;
    }


}

module.exports = SuperSet;
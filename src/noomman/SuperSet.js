const NoommanErrors = require('./NoommanErrors');

/*
 * Class SuperSet
 * Extends Set
 * A mathematical Set with methods for set mathematics.
 */
class SuperSet extends Set {
    
    /*
     * constructor(iterable)
     * Creates a SuperSet containing the items given in iterable parameter.
     * Parameters
     * - iterable - Iterable - An Iterable <Array, Set, Map, etc.> containing items 
     *    to add to this SuperSet.
     * Returns
     * - SuperSet - The SuperSet created containing the items from the given iterable.
     */
    constructor(iterable) {
        super(iterable);
    }

    /* 
     * toString()
     * Implements the toString method for SuperSets.
     * Returns
     * - String - A String representation of this SuperSet.
     */
    toString() {
        return [...this].toString();
    }

    // Set Math

    /* 
     * equals(superSet)
     * Determines if this SuperSet is equal to the given SuperSet. SuperSets are considered
     *    equal if both contain the same elements.
     * Parameters
     * - superSet - SuperSet - A SuperSet to compare this SuperSet to.
     * Returns
     * - Boolean - True if both SuperSets contain the same items.
     * Throws
     * - NoommanArgumentError - If the given superSet is not an instance of SuperSet.
     */
    equals(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.equals() argument is not an SuperSet.');
        
        if (this.size != superSet.size)
            return false;

        if (this.size == 0 && superSet.size == 0)
            return true;

        const equalSet = [...this].reduce((x, y) => {
            return new Set([...x, superSet.has(y)]);
        }, []);

        return !equalSet.has(false);
    }

    /*
     * difference(superSet)
     * Creates a new SuperSet which is the mathematical set difference of this SuperSet
     *    and the given SuperSet. Difference is this SuperSet - given SuperSet.
     * Parameters
     * - superSet - SuperSet - An SuperSet to subtract from this SuperSet.
     * Returns
     * - SuperSet - The set difference of this SuperSet and given SuperSet.
     * Throws
     * - NoommanArgumentError - If superSet parameter is not an instance of SuperSet.
     */
    difference(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.difference() argument is not an SuperSet.');

        return new SuperSet([...this].filter(x => !superSet.has(x)));
    }

    /*
     * intersection(superSet)
     * Creates a new SuperSet which is the mathematical intersection of this SuperSet
     *    and the given SuperSet.
     * Parameters
     * - superSet - SuperSet - An SuperSet to intersect this SuperSet.
     * Returns
     * - SuperSet - The intersection of this SuperSet and given SuperSet.
     * Throws
     * - NoommanArgumentError - If superSet parameter is not an instance of SuperSet.
     */
    intersection(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.difference() argument is not an SuperSet.');

        return new SuperSet([...this].filter(x => superSet.has(x)));
    }

    /*
     * union(superSet)
     * Creates a new SuperSet which is the union of this SuperSet
     *    and the given SuperSet.
     * Parameters
     * - superSet - SuperSet - An SuperSet to union with this SuperSet.
     * Returns
     * - SuperSet - The union of this SuperSet and given SuperSet.
     * Throws
     * - NoommanArgumentError - If superSet parameter is not an instance of SuperSet.
     */
    union(superSet) {
        if (!(superSet instanceof SuperSet))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.difference() argument is not an SuperSet.');

        let combination = new SuperSet();

        [...this, ...superSet].forEach(instance => combination.add(instance));
        return combination;
    }

    /*
     * setsEqual(setA, setB)
     * Determines if two SuperSets are equal. SuperSets are considered equal
     *    if they hold the same items.
     * Parameters
     * - setA - SuperSet - A SuperSet to compare.
     * - setB - SuperSet - A SuperSet to compare.
     * Returns
     * - Boolean - True if the two SuperSets are equal, false otherwise.
     */
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

    /*
     * forEach(callback)
     * Loops through each item in this SuperSet, calling the given callback function and
     *    passing in the item as the parameter. Similar to the native Array.forEach() method.
     * Parameters
     * - callback - Function - A function which accepts an item from this SuperSet as a parameter.
     */
    forEach(callback) {
        [...this].forEach(callback);
    }

    /* 
     * mapToSuperSet(callback)
     * Similar to the native Array.map() method, except that the result is wrapped into a new SuperSet.
     * Parameters
     * - callback - Function - A function which will be run for each item in this SuperSet. Whatever
     *    this function returns for each item will be compiled into a new SuperSet.
     * Returns
     * - SuperSet - a SuperSet which contains the result of each call of the callback function.
     */
    mapToSuperSet(callback) {
        return new SuperSet([...this].map(callback));
    }

    /*
     * map(callback) 
     * Calls the given callback function once for each item in this SuperSet, passing the 
     *    item to the callback as a parameter. The result of each call is returned in an Array.
     * Parameters
     * - callback - Function - A function which will be run for each item in this SuperSet. Whatever
     *    this function returns for each item will be compiled into an array and returned.
     * Returns
     * - Array - An array containing the results of each function call.
     */
    map(callback) {
        return [...this].map(callback);
    }

    /* 
     * reduce(callback) 
     * Similar to the native Array.reduce() method.
     *    See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
     * Parameters
     * - callback - Function - A function to execute on each item in the SuperSet
     *    (except for the first, if no initialValue is supplied).
     * Returns
     * - Any - The accumulated value resulting from calling the callback function for each item in the SuperSet.
     */
    reduce(callback, initialValue=undefined) {
        if (initialValue != undefined)
            return [...this].reduce(callback, initialValue);
        return [...this].reduce(callback);
    }

    /*
     * filter(callback)
     * Creates a new SuperSet containing all the items from this SuperSet for which 
     *    the given callback function returns true. 
     * Paramters
     * - callback - Function - A function which will be run for each item in this SuperSet,
     *    and is expected to return true if this item should be returned in the new
     *    SuperSet, and false if the item should be filtered out of the new SuperSet.
     * Returns
     * - SuperSet - A new SuperSet containing all the items for which the callback function
     *    returned true.
     */
    filter(callback) {
        return [...this].filter(callback);
    }

    /*
     * toArray()
     * Creates an array containing all the same items that are in this SuperSet.
     * Returns
     * - Array - An array containing the same items as this SuperSet.
     */
    toArray() {
        return [...this];
    }

    // Adding elements

    /*
     * addFromIterable(iterable)
     * Adds the given items to this SuperSet.
     * Parameters
     * - iterable - Iterable - An Iterable (Array, Set, etc.) containing items to add to this SuperSet.
     * Throws
     * - NoommanArgumentError - If iterable is given and is not an Iterable.
     */
    addFromIterable(iterable) {
        if (!iterable)
            return;

        //Check if iterable is really iterable
        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.addFromIterable() called with an argument which is not iterable.');

        for (const item of iterable)
            this.add(item);
    }

    /*
     * remove(element) 
     * Removes the given element from this SuperSet. Same as Set.delete().
     * Parameters
     * - element - Any - An item to remove from this SuperSet.
     */
    remove(element) {
        super.delete(element);
    }

    // Removing elements

    /*
     * removeFromIterable(iterable)
     * Removes the given items from this SuperSet.
     * Parameters
     * - iterable - Iterable - An Iterable (Array, Set, etc.) containing items to remove from this SuperSet.
     * Throws
     * - NoommanArgumentError - If iterable is given and is not an Iterable.
     */
    removeFromIterable(iterable) {
        //Check if iterable is really iterable
        if (!iterable)
            return;

        if (!(typeof iterable[Symbol.iterator] === 'function'))
            throw new NoommanErrors.NoommanArgumentError('SuperSet.removeFromIterable() called with an argument which is not iterable.');
        
        if (!this.size)
            return;

        for (const instance of iterable)
            this.remove(instance);
    }

    /*
     * isEmpty()
     * Determines if there are no items in this SuperSet.
     * Returns
     * - Boolean - True if the size of this SuperSet is 0. False otherwise.
     */
    isEmpty() {
        return this.size == 0;
    }


}

module.exports = SuperSet;
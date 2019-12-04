const Instance = require('./Instance');
const SuperSet = require('./SuperSet');
const database = require('./database');
const NoommanErrors = require('./NoommanErrors');

/*
 * Class InstanceSet 
 * Extends SuperSet
 * Represents a mathematical set of Instances, all of the same ClassModel (including Instances of Sub-ClassModels).
 *    Has methods for bulk crud operations, set math operations, and walking relationships.
 */
class InstanceSet extends SuperSet {

    /*
     * constructor(classModel, instances)
     * Creates an instance of InstanceSet with the given classModel.
     * Parameters
     * - classModel - ClassModel - The classModel for this InstanceSet. All Instances added to this InstanceSet
     *     must be of this classModel or one of its sub-ClassModels.
     * - instances - Iterable<Instance> - An Iterable (Array, InstanceSet, etc.) containing Instances.
     * Returns
     * - InstanceSet - The InstanceSet created with the given classModel and instances.
     * Throws
     * - Error - If classModel parameter is missing or not an instance of ClassModel.
     * - Error - If instances is given and is not an Iterable.
     * - Error - If instances is given and contains anything but Instances.
     * - Error - If instances is given and contains any Instance of a different ClassModel.
     */
    constructor(classModel, instances) {
        InstanceSet.constructorValidations(classModel, instances);
        
        super(instances);
        this.classModel = classModel;
    }

    /*
     * constructorValidations(classModel, instances)
     * Ensures that the parameters for constructor() are valid.
     * Parameters
     * - classModel - ClassModel - The ClassModel for this InstanceSet. All Instances added to this InstanceSet
     *     must be of this classModel or one of its sub-ClassModels.
     * - instances - Iterable<Instance> - an Iterable (Array, InstanceSet, etc.) containing Instances.
     * Throws
     * - Error - If classModel parameter is missing or not an instance of ClassModel.
     * - Error - If instances is given and is not an Iterable.
     * - Error - If instances is given and contains anything but Instances.
     * - Error - If instances is given and contains any Instance of a different ClassModel.
     */
    static constructorValidations(classModel, instances) {
        if (!classModel || !classModel.className)
            throw new Error('InstanceSet.constructor() first argument must be an instance of ClassModel.');
        if (instances)
            InstanceSet.addInstancesValidations(classModel, instances);
    }

    /* 
     * addInstancesValidations(classModel, instances)
     * Ensures that instances is an Iterable containing only Instances of the given ClassModel.
     * Parameters
     * - classModel - ClassModel - The classModel that all of the given Instances must be of.
     * - instances - Iterable<Instance> - an Iterable (Array, InstanceSet, etc.) containing Instances.
     * Throws
     * - Error - If instances is given and is not an Iterable.
     * - Error - If instances is given and contains anything but Instances.
     * - Error - If instances is given and contains any Instance of a different ClassModel.
     */
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

    /*
     * add(instance)
     * Adds the given Instance to this InstanceSet.
     * Parameters
     * - instance - Instance - An Instance of the ClassModel for this InstanceSet (or a sub-ClassModel)
     *    to add to this InstanceSet.
     * Throws
     * - Error - If instance is not an Instance.
     * - Error - If instance is an Instance of a different ClassModel.
     */
    add(instance) {
        if (!instance)
            return;
        
        if (this.classModel)
            InstanceSet.addInstancesValidations(this.classModel, [instance]);

        if (this.hasInstance(instance))
            return;

        super.add(instance);
    }

    /*
     * addFromIterable(iterable)
     * Adds the given instances to this InstanceSet.
     * Parameters
     * - iterable - Iterable<Instance> - An Iterable containing instances of the ClassModel for this InstanceSet 
     *    (or a sub-ClassModel) to add to this InstanceSet.
     * Throws
     * - Error - If iterable is given and is not an Iterable.
     * - Error - If iterable is given and contains anything but Instances.
     * - Error - If iterable is given and contains any Instance of a different ClassModel.
     */
    addFromIterable(iterable) {
        this.addInstances(iterable);
    }

    /*
     * addInstances(instances)
     * Adds the given instances to this InstanceSet.
     * Parameters
     * - instances - Iterable<Instance> - An Iterable containing Instances of the ClassModel for this InstanceSet 
     *    (or a sub-ClassModel) to add to this InstanceSet.
     * Throws
     * - Error - If instances is given and is not an Iterable.
     * - Error - If instances is given and contains anything but Instances.
     * - Error - If instances is given and contains any Instance of a different ClassModel.
     */
    addInstances(instances) {
        if (!instances)
            return;

        InstanceSet.addInstancesValidations(this.classModel, instances);

        for (const instance of instances)
            this.add(instance);
    }

    /*
     * remove(instance)
     * Removes the given instance from the set. Any Instance with the same id as the given Instance
     *    will be removed from the InstanceSet, it does not have to be the same in memory object.
     * Parameters
     * - instance - Instance - An Instance to remove from this InstanceSet.
     */
    remove(instance) {
        if (!instance || !(instance instanceof Instance))
            return;

        for (const instanceToCheck of this) {
            if (instanceToCheck._id.equals(instance._id)) {
                super.remove(instanceToCheck);
                break;
            }
        }
    }

    /*
     * removeFromIterable(instances)
     * Removes all the given Instances from this InstanceSet. Any Instance with the same id as any of 
     *    the given Instances will be removed from the InstanceSet. 
     * Parameters
     * - instances - Iterable<Instance> - An Iterable containing Instances of the ClassModel for this InstanceSet 
     *    (or a sub-ClassModel) to remove from this InstanceSet.
     * Throws
     * - Error - If instances parameter is not an Iterable.
     */
    removeFromIterable(instances) {
        this.removeInstances(instances);
    }

    /*
     * removeInstances(instances)
     * Removes all the given Instances from this InstanceSet. Any Instance with the same id as any of 
     *    the given Instances will be removed from the InstanceSet. 
     * Parameters
     * - instances - Iterable<Instance> - An Iterable containing Instances of the ClassModel for this InstanceSet 
     *    (or a sub-ClassModel) to remove from this InstanceSet.
     * Throws
     * - Error - If instances parameter is not an Iterable.
     */
    removeInstances(instances) {
        if (!instances || !this.size)
            return;

        if (!(typeof instances[Symbol.iterator] === 'function'))
            throw new Error('instances argument must be iterable.');
        
        instances.forEach(instance => this.remove(instance));
    }

    /*
     * hasInstance(instanceToCheck)
     * Determines if this InstanceSet contains the given Instance. This is determined using only
     *    the id of the Instances, so the given Instance does not need to be the exact same object
     *    in memory.
     * Parameters
     * - instanceToCheck - Instance - An instance to check for.
     * Returns
     * - Boolean - True if this InstanceSet contains the given Instance, false otherwise.
     */
    hasInstance(instanceToCheck) {
        for (const instance of this) {
            if (instance._id.equals(instanceToCheck._id))
                return true;
        }
        return false;
    }

    /*
     * hasInstanceWithId(id)
     * Determines if this InstanceSet contains an Instance with the given id.
     * Parameters
     * - id - mongodb.ObjectId | String - An id to check for.
     * Returns
     * - Boolean - True if this InstanceSet contains an Instance with the given id, false otherwise.
     */
    hasInstanceWithId(id) {
        if (typeof(id) === 'string') {
            id = database.ObjectId(id);
        }

        for (const instance of this) {
            if (instance._id.equals(id))
                return true;
        }
        return false;
    }

    /*
     * getInstanceWithId(id)
     * Retrieves an Instance from this InstanceSet with the given id.
     * Parameters
     * - id - mongodb.ObjectId | String - An id for the Instance to retrieve.
     * Returns
     * - Instance - The Instance from this InstanceSet with the given Id. Null if 
     *    no Instance in this InstanceSet has the given id.
     */
    getInstanceWithId(id) {
        if (typeof(id) === 'string') {
            id = database.ObjectId(id);
        }

        for (const instance of this) {
            if (instance._id.equals(id))
                return instance;
        }
        return null;
    }

    /*
     * getInstancesWithIds(ids)
     * Retrieves all Instances from this InstanceSet with any of the given ids.
     * Parameters
     * - id - Array<mongodb.ObjectId> - An array of ids for the Instances to retrieve.
     * Returns
     * - InstanceSet - An InstanceSet with the same classModel as this InstanceSet, containing
     *    only those Instances with the given ids.
     */
    getInstancesWithIds(ids) {  
        const instances = new InstanceSet(this.classModel); 
        for (const id of ids) {
            for (const instance of this) {
                if (instance._id.equals(id)) {
                    instances.add(instance);
                    break;
                }
            }
        }
        return instances;
    }

    // Set Math

    /*
     * equals(instanceSet)
     * Determines if this InstanceSet is equal to the given InstanceSet. Two InstanceSets are considered
     *    equal if they hold the same Instances (determined by Instance id).
     * Parameters
     * - instanceSet - InstanceSet - An InstanceSet to compare this InstanceSet against.
     * Returns
     * - Boolean - True if both InstanceSets hold the same Instances, false otherwise.
     * Throws
     * - Error - If instanceSet parameter is not an instance of InstanceSet.
     */
    equals(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.equals() argument is not an InstanceSet.');
        
        if (instanceSet.size != this.size)
            return false;

        if (this.size == 0 && instanceSet.size == 0)
            return true;

        for (const instance of this) {
            if (!instanceSet.hasInstance(instance))
                return false
        }

        return true;
    }

    /*
     * difference(instanceSet)
     * Creates a new InstanceSet which is the mathematical set difference of this InstanceSet
     *    and the given InstanceSet. Difference is this InstanceSet - given InstanceSet.
     * Parameters
     * - instanceSet - InstanceSet - An InstanceSet to subtract from this InstanceSet.
     * Returns
     * - InstanceSet - The set difference of this InstanceSet and given InstanceSet.
     * Throws
     * - Error - If instanceSet parameter is not an instance of InstanceSet.
     */
    difference(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.difference() argument is not an InstanceSet.');

        return new InstanceSet(this.classModel, [...this].filter(x => !instanceSet.hasInstance(x)));
    }

    /*
     * union(instanceSet)
     * Creates a new InstanceSet which is the mathematical set union of this InstanceSet
     *    and the given InstanceSet. 
     * Parameters
     * - instanceSet - InstanceSet - An InstanceSet to union with this InstanceSet.
     * Returns
     * - InstanceSet - The union of this InstanceSet and given InstanceSet.
     * Throws
     * - Error - If instanceSet parameter is not an instance of InstanceSet.
     */
    union(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel, this);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('instanceSet.union() called with argument which is not an InstanceSet');
    
        let combination = new InstanceSet(this.classModel);

        [...this, ...instanceSet].forEach(instance => combination.add(instance));
        return combination;
    }

    /*
     * union(instanceSet)
     * Creates a new InstanceSet which is the mathematical set union of this InstanceSet
     *    and the given InstanceSet. 
     * Parameters
     * - instanceSet - InstanceSet - An InstanceSet to union with this InstanceSet.
     * Returns
     * - InstanceSet - The union of this InstanceSet and given InstanceSet.
     * Throws
     * - Error - If instanceSet parameter is not an instance of InstanceSet.
     */
    intersection(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.intersection() argument is not an InstanceSet.');
            
        if (instanceSet.size == 0 || this.size == 0)
            return new InstanceSet(this.classModel);
        
        return new InstanceSet(this.classModel, [...this].filter(x => instanceSet.hasInstance(x)));
    }

    /*
     * symmetricDifference(instanceSet)
     * Creates a new InstanceSet which is the mathematical symmetricDifference of this InstanceSet
     *    and the given InstanceSet. 
     * Parameters
     * - instanceSet - InstanceSet - An InstanceSet to calculate the symmetric difference of with this InstanceSet.
     * Returns
     * - InstanceSet - The symmetric difference of this InstanceSet and given InstanceSet.
     * Throws
     * - Error - If instanceSet parameter is not an instance of InstanceSet.
     */
    symmetricDifference(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel, this);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.symmetricDifference() argument is not an InstanceSet.');

        const union = this.union(instanceSet);
        const intersection = this.intersection(instanceSet);
        return union.difference(intersection);
    }


    /*
     * setsDifference(instanceSet)
     * Overrides the method SuperSet.setDifference. Not implemented for InstanceSets.
     * Throws
     * - Error - Not Implemented.
     */
    static setsDifference(setA, setB) {
        throw new Error('InstanceSet.setsDifference() is not implemented.');
    }

    // forEach, Map, Reduce, Filter

    /* 
     * mapToInstanceSet(callback)
     * Similar to the map() method, except that the result is wrapped into a new InstanceSet.
     * Parameters
     * - callback - Function - A function which will be run for each Instance in the set. Whatever
     *    this function returns for each instance will be compiled into a new InstanceSet. This 
     *    function must return an Instance which is of the same ClassModel as this InstanceSet.
     * Returns
     * - InstanceSet - An InstanceSet with the same ClassModel as this InstanceSet, which contains
     *    each result of each call of the callback function.
     */
    mapToInstanceSet(callback) {
        return new InstanceSet(this.classModel, [...this].map(callback));
    }

    /*
     * filterToInstanceSet(callback)
     * Similar to the filter() method, except that the results are compiled into an
     *    InstanceSet.
     * Parameters
     * - callback - Function - A callback function which will be run on each Instance of 
     *    this InstanceSet. If this function returns true for an Instance, then the Instance
     *    will be added to the return InstanceSet.
     * Returns
     * - InstanceSet - A new InstanceSet with the same ClassModel as this InstanceSet, and 
     *    containing all the instances for which the given callback function returns true.
     */
    filterToInstanceSet(callback) {
        return new InstanceSet(this.classModel, [...this].filter(callback));
    }

    /*
     * filterForClassModel(classModel)
     * Creates a new InstanceSet which contains all the Instances from this InstanceSet which are 
     *    of the given ClassModel (or a sub-ClassModel thereof).
     * Parameters
     * - classModel - ClassModel - A ClassModel to use to filter this InstanceSet.
     * Returns
     * - InstanceSet - An InstanceSet with the same ClassModel as this InstanceSet, which contains
     *    all Instances from the origin InstanceSet which are of the given ClassModel (or a 
     *    ClassModel thereof).
     * Throws
     * - Error - If the given classModel paramter is omitted or not an instance of ClassModel.
     */
    filterForClassModel(classModel) {
        if (!classModel || !classModel.className) 
            throw new Error('instanceSet.filterForClassModel(): argument must be a ClassModel.');
        
        const filtered = this.filter((instance) => {
            return instance.isInstanceOf(classModel);
        });

        return new InstanceSet(classModel, filtered);
    }

    /*
     * filterForInstancesInThisCollection()
     * Creates a new InstanceSet which is this InstanceSet filtered for those Instances
     *    that are stored in the same collection as the collection for the ClassModel
     *    of this InstanceSet.
     * Returns
     * - InstanceSet - A new InstanceSet with the same ClassModel as this InstanceSet, 
     *    containing all the Instances from this InstanceSet which share the same collection
     *    as this InstanceSet.
     */
    filterForInstancesInThisCollection() {
        if (this.classModel.abstract && !this.classModel.discriminated())
            return new InstanceSet(this.classModel);

        return this.filterToInstanceSet(instance => 
                instance.classModel.collection === this.classModel.collection
            );
    }

    // Validate, Save, Walk, Delete

    /* 
     * validate()
     * Throws an error if any Instance in this InstanceSet is invalid for any reason, 
     *    including violations of custom validations, required properties, required groups, 
     *    or mutexes.
     * Throws
     * - Error - If a required property is not set on an Instance.
     * - Error - If none of the properties in a required group are set on an Instance.
     * - Error - If more than one property in a mutex are set on an Instance.
     * - Error - If a custom validation method from the ClassModel fails on an Instance.
     */
    async validate() {
        const promises = [];

        for (const instance of this) {
            promises.push(instance.validate());
        }

        await Promise.all(promises);
    }
    
    /*
     * save(createControlMethodParameters, updateControlMethodParameters)
     * Saves the current state of each Instance in this InstanceSet to the database in the proper 
     *    collection according to its ClassModel.
     * Parameters
     * - createControlMethodParameters - Object - An object containing parameters needed by a createControl method.
     * - updateControlMethodParameters - Object - An object containing parameters needed by a updateControl method.
     * Returns
     * - Promise<Array<Instance>> - An Array containing each Instance in this InstanceSet, if save is successful.
     * Throws
     * - Error - If an Instance has already been deleted.
     * - Error - If an Instance has been stripped by stripSensitiveAttributes().
     * - Error - If a call to validate() for an Instance throws an error.
     * - Error - If an Instance does not pass createControl or updateControl methods.
     */ 
    async save(createControlMethodParameters, updateControlMethodParameters) {
        const instancesToUpdate = this.filterToInstanceSet(instance => instance.saved());
        const instancesToCreate = this.difference(instancesToUpdate);

        try {
            await this.validate();
        }
        catch (error) {
            throw new Error('Caught validation error when attempting to save InstanceSet: ' + error.message);
        }
        
        await this.classModel.updateControlCheck(instancesToUpdate, updateControlMethodParameters);
        await this.classModel.createControlCheck(instancesToCreate, createControlMethodParameters);

        for (const instance of this) {
            if (instance.stripped()) {
                throw new Error('Attempt to save an InstanceSet which contains stripped instances.');
            }
        }

        await this.classModel.updateRelatedInstancesForInstanceSet(this);

        let promises = this.map(instance => instance.saveWithoutValidation())
        await Promise.all(promises);
    }
    
    /*
     * saveWithoutRelatedUpdates(createControlMethodParameters, updateControlMethodParameters)
     * Saves the current state of each Instance in this InstanceSet to the database in the proper 
     *    collection according to its ClassModel. Does not save any related Instances for which 
     *    a two-way relationship has been updated. Internal use only.
     * Parameters
     * - createControlMethodParameters - Object - An object containing parameters needed by a createControl method.
     * - updateControlMethodParameters - Object - An object containing parameters needed by a updateControl method.
     * Returns
     * - Promise<Array<Instance>> - An array containing each Instance in this InstanceSet, if save is successful.
     * Throws
     * - Error - If an Instance has already been deleted.
     * - Error - If an Instance has been stripped by stripSensitiveAttributes().
     * - Error - If a call to validate() for an Instance throws an error.
     * - Error - If an Instance does not pass createControl or updateControl methods.
     */ 
    async saveWithoutRelatedUpdates(createControlMethodParameters, updateControlMethodParameters) {
        const instancesToUpdate = this.filterToInstanceSet(instance => instance.saved());
        const instancesToCreate = this.difference(instancesToUpdate);

        try {
            await this.validate();
        }
        catch (error) {
            throw new Error('Caught validation error when attempting to save InstanceSet: ' + error.message);
        }
        
        await this.classModel.updateControlCheck(instancesToUpdate, updateControlMethodParameters);
        await this.classModel.createControlCheck(instancesToCreate, createControlMethodParameters);

        let promises = this.map(instance => instance.saveWithoutValidation())
        await Promise.all(promises);
    }

    /*
     * walkValidations(relationshipName) 
     * Runs validations for the walk() method.
     * Paramters
     * - relationshipName - String - The name of a relationship to walk.
     * Throws
     * - Error - If no relationshipName is given.
     * - Error - If relationshipName is not a String.
     * - Error - If relationshipName does not match a relationship on the ClassModel
     *    for this InstanceSet.
     */
    walkValidations(relationshipName) {
        if (!relationshipName) 
            throw new Error('InstanceSet.walk() called without relationship.');

        if (typeof(relationshipName) !== 'string')
            throw new Error('InstanceSet.walk() relationship argument must be a String.');

        if (!this.classModel.relationships.map(relationship => relationship.name).includes(relationshipName))
            throw new Error('InstanceSet.walk() called with an invalid relationship for ClassModel ' + this.classModel.className + '.');
    }

    /*
     * walk(relationshipName) 
     * Walks the relationship with the given relationshipName for every Instance in this
     *    InstanceSet, and returns the result in a single InstanceSet. Will populate the 
     *    relationship on each Instance as well. 
     * Paramters
     * - relationshipName - String - The name of a relationship to walk.
     * Returns
     * - InstanceSet - an InstanceSet containing all the Instances related to the Instances
     *    in this InstanceSet through the relationship with the given relationshipName.
     * Throws
     * - Error - If no relationshipName is given.
     * - Error - If relationshipName is not a String.
     * - Error - If relationshipName does not match a relationship on the ClassModel
     *    for this InstanceSet.
     */
    async walk(relationshipName) {
        this.walkValidations(relationshipName);

        if(this.isEmpty())
            return new InstanceSet(relatedClass);
        
        const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name ===relationshipName)[0];
        const relatedClass = this.classModel.getRelatedClassModel(relationshipName);
        const instanceIdsToFind = [];
        const walkResult = new InstanceSet(relatedClass);

        // Determine which instances we need to get from the database.
        if (relationshipDefinition.singular) {
            for (const instance of this) {
                if (!(instance['_' + relationshipName] instanceof Instance) && !instanceIdsToFind.includes(instance['_' + relationshipName])) {
                    instanceIdsToFind.push(instance['_' + relationshipName]);
                }
            }
        }
        else {
            for (const instance of this) {
                if (!(instance['_' + relationshipName] instanceof InstanceSet)) {
                    if (instance['_' + relationshipName].length == 0)
                        continue;
                    for (const id of instance['_' + relationshipName]) {
                        if (!instanceIdsToFind.includes(id)) {
                            instanceIdsToFind.push(id);
                        }
                    }
                }
            }
        }

        // If there are instances to find, retrieve them and populate instance relationships.
        if (instanceIdsToFind.length) {
            // Retrieve instances from database.
            const instancesRetrieved = await relatedClass.pureFind({ _id: { $in: instanceIdsToFind } });
    
            // Populate individual instance relationships.
            if (relationshipDefinition.singular) {
                for (const instance of this) {
                    if (!(instance['_' + relationshipName] instanceof Instance) && instance['_' + relationshipName] !== null) {
                        instance[relationshipName] = instancesRetrieved.getInstanceWithId(instance['_' + relationshipName]);
                    }
                }
            }
            else {
                for (const instance of this) {
                    if (!(instance['_' + relationshipName] instanceof InstanceSet) && instance['_' + relationshipName].length !== 0) {
                        instance[relationshipName] = instancesRetrieved.getInstancesWithIds(instance['_' + relationshipName]);
                    }
                }    
            }
        }

        // Return combination of all instance relationships.
        for (const instance of this) {
            if (relationshipDefinition.singular) {
                walkResult.add(instance['_' + relationshipName]);
            }
            else {
                walkResult.addInstances(instance['_' + relationshipName]);
            }
        }

        return walkResult;
    }

    /*
     * readControlFilter(readControlMethodParameters)
     * Runs applicable readControl methods for each Instance in this InstanceSet, and filters out any
     *    Instances for which any readControl method returns false. Returns a new InstanceSet, does not 
     *    update this InstanceSet.
     * Parameters
     * - readControlMethodParameters - Object - An object containing any parameters that the readControl method(s)
     *    may need.
     * Returns
     * - Promise<InstanceSet> - An InstanceSet containing those Instances for which all readControl methods return true.
     */
    async readControlFilter(readControlMethodParameters) {
        return this.classModel.readControlFilter(this, readControlMethodParameters);
    }

    /*
     * delete(deleteControlMethodParameters) 
     * Deletes all Instances in this InstanceSet from the database.
     * Parameters
     * - deleteControlMethodParameters - Object - An object containing any parameters needed by a deleteControl method.
     * Returns
     * - Promise<Array<Boolean>> - An array containing True for each deleted Instance
     *    if all Instances in this InstanceSet are deleted properly.
     * Throws
     * - Error - If any Instance has not yet been saved (i.e. is not in the database).
     * - Error - If deleteControl method returns false for any Instance.
     */
    async delete(deleteControlMethodParameters) {
        if (this.size == 0)
            return;

        const unsavedInstances = this.filter(instance => instance.saved() == false)

        if (unsavedInstances.length) 
            throw new Error('Attempt to delete an InstanceSet containing unsaved Instances.');

        await this.classModel.deleteControlCheck(this, deleteControlMethodParameters);

        const deletePromises = [];

        for (const instance of this) {
            deletePromises.push(instance.delete(deleteControlMethodParameters));
        }

        return Promise.all(deletePromises);
    }

    /*
     * stripSensitiveAttributes()
     * Will remove any attributes with property sensitive equal to true from each Instance
     *    in this InstanceSet.
     */
    stripSensitiveAttributes() {
        for (const instance of this) {
            instance.stripSensitiveAttributes();
        }
    }

    /*
     * getInstanceIds()
     * Retrieves the id for each Instance in this InstanceSet as a String and returns
     *    them in an array.
     * Returns
     * - Array<String> - An array containing string representations of each Instance's id.
     * */
    getInstanceIds() {
        return this.map(instance => instance.id);
    }

    /*
     * getObjectIds()
     * Retrieves the id for each Instance in this InstanceSet and returns
     *    them in an Array.
     * Returns
     * - Array<ObjectId> - An array containing each Instance's id.
     * */
    getObjectIds() {
        return this.map(instance => instance._id);
    }

    /*
     * isInstanceOf(classModel)
     * Determines if this InstanceSet is an InstanceSet of the given classModel
     *    or one of its sub-ClassModels.
     * Parameters
     * - classModel - ClassModel - A ClassModel to check if this is an InstanceSet of.
     * Returns
     * - Boolean - True if this InstanceSet is an InstanceSet of the given classModel
     *    or one of its sub-ClassModels. False otherwise.
     */
    isInstanceSetOf(classModel) {
        return classModel.isInstanceSetOfThisClass(this);
    }

}

module.exports = InstanceSet;
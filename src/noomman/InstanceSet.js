const Instance = require('./Instance');
const SuperSet = require('./SuperSet');
const database = require('./database');

class InstanceSet extends SuperSet {

    constructor(classModel, instances) {
        InstanceSet.constructorValidations(classModel, instances);
        
        super(instances);
        this.classModel = classModel;
    }

    static constructorValidations(classModel, instances) {
        if (!classModel || !classModel.className)
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

        if (this.hasInstance(instance))
            return;

        super.add(instance);
    }

    addFromIterable(iterable) {
        this.addInstances(iterable);
    }

    addInstances(instances) {
        if (!instances)
            return;

        InstanceSet.addInstancesValidations(this.classModel, instances);

        for (const instance of instances)
            this.add(instance);
    }

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

    hasInstance(instanceToCheck) {
        for (const instance of this) {
            if (instance._id.equals(instanceToCheck._id))
                return true;
        }
        return false;
    }

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

    difference(instanceSet) {
        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.difference() argument is not an InstanceSet.');

        return new InstanceSet(this.classModel, [...this].filter(x => !instanceSet.hasInstance(x)));
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

    intersection(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.intersection() argument is not an InstanceSet.');
            
        if (instanceSet.size == 0 || this.size == 0)
            return new InstanceSet(this.classModel);
        
        return new InstanceSet(this.classModel, [...this].filter(x => instanceSet.hasInstance(x)));
    }

    symmetricDifference(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel, this);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.symmetricDifference() argument is not an InstanceSet.');

        const union = this.union(instanceSet);
        const intersection = this.intersection(instanceSet);
        return union.difference(intersection);
    }

    static setsDifference(setA, setB) {
        throw new Error('InstanceSet.setsDifference() is not implemented.');
    }

    // forEach, Map, Reduce, Filter

    mapToInstanceSet(callback) {
        return new InstanceSet(this.classModel, [...this].map(callback));
    }

    filterToInstanceSet(callback) {
        return new InstanceSet(this.classModel, [...this].filter(callback));
    }

    filterForClassModel(classModel) {
        if (!classModel || !classModel.className) 
            throw new Error('instanceSet.filterForClassModel(): argument must be a ClassModel.');
        
        const filtered = this.filter((instance) => {
            return instance.isInstanceOf(classModel);
        });

        return new InstanceSet(classModel, filtered);
    }

    filterForInstancesInThisCollection() {
        if (this.classModel.abstract && !this.classModel.discriminated())
            return new InstanceSet(this.classModel);

        return this.filterToInstanceSet(instance => 
                instance.classModel.collection === this.classModel.collection
            );
    }

    // Validate, Save, Walk, Delete

    async validate() {
        const promises = [];

        for (const instance of this) {
            promises.push(instance.validate());
        }

        await Promise.all(promises);
    }
    
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

        await this.classModel.updateRelatedInstancesForInstanceSet(this);

        let promises = this.map(instance => instance.saveWithoutValidation())
        await Promise.all(promises);
    }

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

    walkValidations(relationshipName) {
        if (!relationshipName) 
            throw new Error('InstanceSet.walk() called without relationship.');

        if (typeof(relationshipName) !== 'string')
            throw new Error('InstanceSet.walk() relationship argument must be a String.');

        if (!this.classModel.relationships.map(relationship => relationship.name).includes(relationshipName))
            throw new Error('InstanceSet.walk() called with an invalid relationship for ClassModel ' + this.classModel.className + '.');
    }

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

    async readControlFilter(readControlMethodParameters) {
        return this.classModel.readControlFilter(this, readControlMethodParameters);
    }

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

    getInstanceIds() {
        return this.map(instance => instance.id);
    }

    getObjectIds() {
        return this.map(instance => instance._id);
    }

    isInstanceSetOf(classModel) {
        return classModel.isInstanceSetOfThisClass(this);
    }

}

module.exports = InstanceSet;
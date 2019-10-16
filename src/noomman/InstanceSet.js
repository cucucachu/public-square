require('@babel/polyfill');

const Instance = require('./Instance');
const SuperSet = require('./SuperSet');

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

    intersection(instanceSet) {
        if (!instanceSet)
            return new InstanceSet(this.classModel);

        if (!(instanceSet instanceof InstanceSet))
            throw new Error('InstanceSet.intersection() argument is not an InstanceSet.');
            
        if (instanceSet.size == 0 || this.size == 0)
            return new InstanceSet(this.classModel);
        
        return new InstanceSet(this.classModel, [...this].filter(x => instanceSet.has(x)));
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
        if (this.classModel.abstract && !this.classModel.discriminated)
            return new InstanceSet(this.classModel);

        return this.filterToInstanceSet(instance => 
                instance.classModel === this.classModel || instance.classModel.discriminatorSuperClass == this.classModel
            );
    }

    // Validate, Save, Walk, Delete

    validate() {
        this.forEach(instance => instance.validate());
    }
    
    async save(...controlMethodParameters) {
        const instancesToUpdate = this.filterToInstanceSet(instance => instance.saved());
        const instancesToCreate = this.difference(instancesToUpdate);

        try {
            this.validate();
        }
        catch (error) {
            throw new Error('Caught validation error when attempting to save InstanceSet: ' + error.message);
        }
        
        await this.classModel.updateControlCheck(instancesToUpdate, ...controlMethodParameters);
        await this.classModel.createControlCheck(instancesToCreate, ...controlMethodParameters);

        let promises = this.map(instance => instance.saveWithoutValidation())
        await Promise.all(promises);
    }

    walkValidations(relationshipName, filter) {
        if (!relationshipName) 
            throw new Error('InstanceSet.walk() called without relationship.');

        if (typeof(relationshipName) !== 'string')
            throw new Error('InstanceSet.walk() relationship argument must be a String.');

        if (!this.classModel.relationships.map(relationship => relationship.name).includes(relationshipName))
            throw new Error('InstanceSet.walk() called with an invalid relationship for ClassModel ' + this.classModel.className + '.');
        
        if (filter && typeof(filter) !== "object")
            throw new Error('InstanceSet.walk() filter argument must be an object.');
    }

    async walk(relationshipName, filter=null, ...accessControlMethodParameters) {
        this.walkValidations(relationshipName, filter);

        const relationshipDefinition = this.classModel.relationships.filter(relationship => relationship.name === relationshipName)[0];
        const relatedClass = this.classModel.getRelatedClassModel(relationshipName);
        const noFilter = filter ? false : true;
        filter = filter ? filter : {};
        let instanceIdsToFind;
        const instancesAlreadyFound = new InstanceSet(relatedClass);

        if(this.isEmpty())
            return new InstanceSet(relatedClass);

        if (relationshipDefinition.singular) {
            if (noFilter) {
                const populatedRelationships = this.map(instance => instance[relationshipName]).filter(instance => instance instanceof Instance);
                instancesAlreadyFound.addInstances(populatedRelationships);
                instanceIdsToFind = this.map(instance => instance[relationshipName]).filter(instanceOrId => instanceOrId !== null && !(instanceOrId instanceof Instance));
                const instanceIdsAlreadyFound = instancesAlreadyFound.map(instance => instance.id);
                instanceIdsToFind = instanceIdsToFind.filter(id => !instanceIdsAlreadyFound.includes(id.toHexString()));
            }
            else {
                instanceIdsToFind = this.map(instance => instance[relationshipName]);
                instanceIdsToFind = instanceIdsToFind.map(instanceOrId => {
                    if (instanceOrId instanceof Instance) {
                        return instanceOrId._id;
                    }
                    else {
                        return instanceOrId;
                    }
                });
                instanceIdsToFind = instanceIdsToFind.filter(id => id !== null);
            }
        }
        else {
            if (noFilter) {
                instanceIdsToFind = this
                    .map(instance => instance[relationshipName])
                    .filter(ids => {
                         return (ids != null && Array.isArray(ids) && ids.length); 
                        })
    
                if (instanceIdsToFind.length)
                    instanceIdsToFind = instanceIdsToFind.reduce((acc, cur) => acc.concat(cur));
    
                let populatedRelationships = this.map(instance => instance[relationshipName]).filter(instanceSet => instanceSet instanceof InstanceSet && instanceSet.size);             
                
                if (populatedRelationships.length) {
                    populatedRelationships = populatedRelationships.forEach(instanceSet => instancesAlreadyFound.addInstances(instanceSet));
                }
                const instanceIdsAlreadyFound = instancesAlreadyFound.map(instance => instance.id);
                instanceIdsToFind = instanceIdsToFind.filter(id => !instanceIdsAlreadyFound.includes(id.toHexString()));
            }
            else {
                instanceIdsToFind = this.map(instance => instance[relationshipName]);
                instanceIdsToFind = instanceIdsToFind.map(instanceSetOrIds => {
                    if (instanceSetOrIds instanceof InstanceSet) {
                        return instanceSetOrIds.getObjectIds();
                    }
                    else {
                        return instanceSetOrIds;
                    }
                });
                instanceIdsToFind = instanceIdsToFind.filter(ids => Array.isArray(ids) && ids.length);
                if (instanceIdsToFind.length)
                    instanceIdsToFind = instanceIdsToFind.reduce((acc, cur) => acc.concat(cur));
            }
        }

        let instancesFound = new InstanceSet(relatedClass);

        if (instanceIdsToFind.length) {
            instanceIdsToFind =  [...(new Set(instanceIdsToFind))];
    
            Object.assign(filter, {
                _id: {$in : instanceIdsToFind},
            });

            instancesFound = await relatedClass.find(filter, ...accessControlMethodParameters);
        }

        return instancesFound.union(instancesAlreadyFound);
    }

    async delete(...deleteControlMethodParameters) {
        const unsavedInstances = this.filter(instance => instance.saved() == false)

        if (unsavedInstances.length) 
            throw new Error('Attempt to delete an InstanceSet containing unsaved Instances.');

        await this.classModel.deleteControlCheck(this, ...deleteControlMethodParameters);

        await this.deleteRecursive();
    }

    async deleteRecursive() {
        let deletePromises = [];
        const instancesOfThisCollection = this.filterForInstancesInThisCollection();

        for (const subClass of this.classModel.subClasses) {
            const instancesOfSubClass = this.filterForClassModel(subClass);
            deletePromises.push(instancesOfSubClass.deleteRecursive());
        }

        if (!instancesOfThisCollection.isEmpty()) {
            await this.classModel.deleteMany(instancesOfThisCollection);
            instancesOfThisCollection.forEach(instance => instance.currentState = null);
        }
        
        if (deletePromises.length)
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
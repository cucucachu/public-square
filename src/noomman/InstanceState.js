require('@babel/polyfill');
const moment = require('moment');
const mongoose = require('mongoose');

const SuperSet = require('./SuperSet');
const InstanceReference = require('./InstanceReference');
const InstanceSetReference = require('./InstanceSetReference');

class InstanceState {
    constructor(classModel, document) {
        this.attributes = {};
        this.instanceReferences = {};
        this.instanceSetReferences = {};

        if (!classModel)
            throw new Error('new InstanceState(): First argument \'classModel\' is required.');
        
        const attributes = classModel.getAttributes();
        const singularRelationships = classModel.getSingularRelationships();
        const nonSingularRelationships = classModel.getNonSingularRelationships();

        for (const attribute of attributes) {
            if (attribute.list)
                this.attributes[attribute.name] = (document && document[attribute.name]) ? document[attribute.name] : [];
            else {
                this.attributes[attribute.name] = (document && document[attribute.name] !== undefined) ? document[attribute.name] : null;
            }
        }
        for (const singularRelationship of singularRelationships) {
            const instanceReference = new InstanceReference();
            if (document && document[singularRelationship.name])
                instanceReference._id = document[singularRelationship.name];
            this.instanceReferences[singularRelationship.name] = instanceReference;
        }
        for (const nonSingularRelationship of nonSingularRelationships) {
            const instanceSetReference = new InstanceSetReference();
            if (document && document[nonSingularRelationship.name])
                instanceSetReference._ids = document[nonSingularRelationship.name];
            this.instanceSetReferences[nonSingularRelationship.name] = instanceSetReference;
        }

        return new Proxy(this, {
            set(trapTarget, key, value, receiver) {
                if (key in trapTarget.attributes) {
                    if (attributes.filter(attribute => attribute.name === key)[0].list && value === null)
                        value = [];
                    trapTarget.attributes[key] = value;
                }
                else if (key in trapTarget.instanceReferences) {
                    if (value === null) {
                        trapTarget.instanceReferences[key]._id = null;
                        trapTarget.instanceReferences[key].instance = null;
                    }
                    else {
                        trapTarget.instanceReferences[key]._id = value._id;
                        trapTarget.instanceReferences[key].instance = value;
                    }
                }
                else if (key in trapTarget.instanceSetReferences) {
                    if (value === null) {
                        trapTarget.instanceSetReferences[key]._ids = [];
                        trapTarget.instanceSetReferences[key].instanceSet = null;
                    }
                    else {
                        trapTarget.instanceSetReferences[key]._ids = value.map(instance => instance._ids);
                        trapTarget.instanceSetReferences[key].instanceSet = value;
                    }
                }
                else {
                    throw new Error('Attempt to set an invalid property on an InstanceState.');
                }
                return true;
            },

            get(trapTarget, key, receiver) {
                if (key in trapTarget.attributes) {
                    return trapTarget.attributes[key];
                }
                else if (key in trapTarget.instanceReferences) {
                    return trapTarget.instanceReferences[key].instance ? trapTarget.instanceReferences[key].instance : trapTarget.instanceReferences[key]._id;
                }
                else if (key in trapTarget.instanceSetReferences) {
                    return trapTarget.instanceSetReferences[key].instanceSet ? trapTarget.instanceSetReferences[key].instanceSet : trapTarget.instanceSetReferences[key]._ids;
                }
                else {
                    return Reflect.get(trapTarget, key, receiver);
                }
            },
            
            has(trapTarget, key) {
                return ((key in trapTarget.attributes) || (key in trapTarget.instanceReferences) || (key in trapTarget.instanceSetReferences))
            },

            deleteProperty(trapTarget, key) {
                if (attributes.map(attribute => attribute.name).includes(key)) {
                    const attribute = attributes.filter(attribute => attribute.name === key)[0];
                    if (attribute.list) {
                        trapTarget.attributes[key] = [];
                        return true;
                    }
                    else {
                        trapTarget.attributes[key] = null;
                        return true;
                    }
                }

                if (singularRelationships.map(relationship => relationship.name).includes(key)) {
                    trapTarget.instanceReferences[key].instance = null;
                    trapTarget.instanceReferences[key]._id = null;
                    return true;
                }

                if (nonSingularRelationships.map(relationship => relationship.name).includes(key)) {
                    trapTarget.instanceSetReferences[key].instanceSet = null;
                    trapTarget.instanceSetReferences[key]._ids = [];
                    return true;
                }

            }
        });
    }

    sync() {
        for (const instanceSetReference in this.instanceSetReferences) {
            this.instanceSetReferences[instanceSetReference].sync();
        }
    }

    equals(that) {
        this.sync();
        that.sync();

        for (attributeName in this.attributes) {
            if (this.attributes[attributeName] !== that.attributes[attributeName])
                return false;
        }
        for (singularRelationshipName in this.instanceReferences) {
            if (!this.instanceReferences[singularRelationshipName].equals(that.instanceReferences[singularRelationshipName]))
                return false
        }
        for (nonSingularRelationshipName in this.instanceSetReferences) {
            if (!this.instanceSetReferences[nonSingularRelationshipName].equals(that.instanceSetReferences[nonSingularRelationshipName]))
                return false;
        }
        return true;
    }

    static listAttributesEqual(array1, array2) {
        if (array1.length != array2.length)
            return false;

        for (const index in array1)
            if (array1[index] !== array2[index])
                return false;

        return true;
    }

    toDocument() {
        this.sync();
        const document = {};

        for (const attributeName in this.attributes) {
            const attribute = this.attributes[attributeName];
            if (Array.isArray(attribute) && attribute.length == 0)
                continue;
            if (attribute !== null && attribute !== undefined) 
                document[attributeName] = attribute;
        }

        for (const relationshipName in this.instanceReferences) {
            const relationship = this.instanceReferences[relationshipName];
            if (!relationship.isEmpty())
                document[relationshipName] = relationship._id;
        }

        for (const relationshipName in this.instanceSetReferences) {
            const relationship = this.instanceSetReferences[relationshipName];

            if (!relationship.isEmpty())
                document[relationshipName] = relationship._ids;
        }

        return document;        
    }

    diff(that) {
        this.sync();
        that.sync();
        const diffObject = {
            add: {},
            remove: {},
            update: {},
        }

        for (const attributeName in this.attributes) {
            const thisAttribute = this.attributes[attributeName];
            const thatAttribute = that.attributes[attributeName];

            if (!Array.isArray(thisAttribute)) {
                if (thisAttribute === null && thatAttribute === null) {
                    continue;
                }
                else if (thisAttribute !== null && thatAttribute === null) {
                    diffObject.add[attributeName] = thisAttribute;
                }
                else if (thisAttribute === null && thatAttribute !== null) {
                    diffObject.remove[attributeName] = thatAttribute;
                }
                else {
                    if (thisAttribute instanceof Date) {
                        if (!moment(thisAttribute).isSame(thatAttribute)) {
                            diffObject.update[attributeName] = {
                                value: thisAttribute,
                                previous: thatAttribute,
                                insert: thisAttribute,
                                remove: thatAttribute,
                            }
                        }              
                    }
                    else {
                        if (thisAttribute !== thatAttribute) {
                            diffObject.update[attributeName] = {
                                value: thisAttribute,
                                previous: thatAttribute,
                                insert: thisAttribute,
                                remove: thatAttribute,
                            }
                        }
                    }
                }
            }
            else {
                if (thisAttribute.length === 0 && thatAttribute.length === 0) {
                    continue;
                }
                else if (thisAttribute.length !== 0 && thatAttribute.length === 0) {
                    diffObject.add[attributeName] = thisAttribute;
                }
                else if (thisAttribute.length === 0 && thatAttribute.length !== 0) {
                    diffObject.remove[attributeName] = thatAttribute;
                }
                else {

                    if (!InstanceState.listAttributesEqual(thisAttribute, thatAttribute)) {
                        const thisSet = new SuperSet(thisAttribute);
                        const thatSet = new SuperSet(thatAttribute);
                        const toInsert = thisSet.difference(thatSet);
                        const toRemove = thatSet.difference(thisSet);
    
                        diffObject.update[attributeName] = {
                            value: thisAttribute,
                            previous: thatAttribute,
                            insert: [...toInsert],
                            remove: [...toRemove],
                        }
                    }
                }
            }
        }

        for (const instanceReference in this.instanceReferences) {
            const instanceReferenceDiff = this.instanceReferences[instanceReference].diff(that.instanceReferences[instanceReference]);
            if (instanceReferenceDiff.add)
                diffObject.add[instanceReference] = instanceReferenceDiff.add;
            if (instanceReferenceDiff.remove)
                diffObject.remove[instanceReference] = instanceReferenceDiff.remove;
            if (instanceReferenceDiff.update)
                diffObject.update[instanceReference] = instanceReferenceDiff.update;
        }

        for (const instanceSetReference in this.instanceSetReferences) {
            const instanceSetReferenceDiff = this.instanceSetReferences[instanceSetReference].diff(that.instanceSetReferences[instanceSetReference]);
            if (instanceSetReferenceDiff.add)
                diffObject.add[instanceSetReference] = instanceSetReferenceDiff.add;
            if (instanceSetReferenceDiff.remove)
                diffObject.remove[instanceSetReference] = instanceSetReferenceDiff.remove;
            if (instanceSetReferenceDiff.update)
                diffObject.update[instanceSetReference] = instanceSetReferenceDiff.update;
        }

        return diffObject;

    }

}

module.exports = InstanceState;
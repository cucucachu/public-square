require('@babel/polyfill');
const moment = require('moment');

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

        for (const attribute of classModel.getAttributes()) {
            if (attribute.list)
                this.attributes[attribute.name] = (document && document[attribute.name]) ? document[attribute.name] : [];
            else {
                this.attributes[attribute.name] = (document && document[attribute.name] !== undefined) ? document[attribute.name] : null;
            }
        }
        for (const singularRelationship of classModel.getSingularRelationships()) {
            const instanceReference = new InstanceReference();
            if (document && document[singularRelationship.name])
                instanceReference.id = document[singularRelationship.name];
            this.instanceReferences[singularRelationship.name] = instanceReference;
        }
        for (const nonSingularRelationship of classModel.getNonSingularRelationships()) {
            const instanceSetReference = new InstanceSetReference();
            if (document && document[nonSingularRelationship.name])
                instanceSetReference.ids = document[nonSingularRelationship.name];
            this.instanceSetReferences[nonSingularRelationship.name] = instanceSetReference;
        }

        return new Proxy(this, {
            set(trapTarget, key, value, receiver) {
                if (key in trapTarget.attributes) {
                    trapTarget.attributes[key] = value;
                }
                else if (key in trapTarget.instanceReferences) {
                    trapTarget.instanceReferences[key].id = value.id;
                    trapTarget.instanceReferences[key].instance = value;
                }
                else if (key in trapTarget.instanceSetReferences) {
                    trapTarget.instanceReferences[key].ids = value.getInstanceIds();
                    trapTarget.instanceReferences[key].instanceSet = value;
                }
                else {
                    throw new Error('Attempt to set an invalid property on an InstanceState.');
                }
            },

            get(trapTarget, key, receiver) {
                if (key in trapTarget.attributes) {
                    return trapTarget.attributes[key];
                }
                else if (key in trapTarget.instanceReferences) {
                    return trapTarget.instanceReferences[key].instance ? trapTarget.instanceReferences[key].instance : trapTarget.instanceReferences[key].id;
                }
                else if (key in trapTarget.instanceSetReferences) {
                    return trapTarget.instanceSetReferences[key].instance ? trapTarget.instanceSetReferences[key].instanceSet : trapTarget.instanceSetReferences[key].ids;
                }
                else {
                    return Reflect.get(trapTarget, key, receiver);
                }
            },
            
            has(trapTarget, key) {
                return ((key in trapTarget.attributes) || (key in trapTarget.instanceReferences) || (key in trapTarget.instanceSetReferences))
            }
        });
    }

    equals(that) {
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

    diff(that) {
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
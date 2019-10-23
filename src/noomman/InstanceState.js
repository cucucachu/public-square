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
        
        const attributes = classModel.attributes;
        const singularRelationships = classModel.relationships.filter(relationship => relationship.singular);
        const nonSingularRelationships = classModel.relationships.filter(relationship => !relationship.singular);

        this.classModel = classModel;

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
                        trapTarget.instanceSetReferences[key]._ids = value.map(instance => instance._id);
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

        for (const attributeName in this.attributes) {
            const attributeDefinition = this.classModel.attributes.filter(attribute => attribute.name === attributeName)[0];
            const thisAttribute = this.attributes[attributeName];
            const thatAttribute = that.attributes[attributeName];

            if (attributeDefinition.list) {
                const thisArray = [...thisAttribute];
                const thatArray = [...thatAttribute];

                if (thisArray.length !== thatArray.length) {
                    return false;
                }
                for (const index in thisArray) {
                    if ((thisArray[index] === null && thatArray[index]) || (thisArray[index] && thatArray[index] === null))
                        return false;

                    if (attributeDefinition.type === Date) {
                        if (thisArray[index] === null && thatArray[index] === null)
                            continue;
                        
                        if (!moment(thisArray[index]).isSame(thatArray[index])) {
                            return false;
                        }
                    }
                    else {
                        if (thisArray[index] !== thatArray[index]) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (attributeDefinition.type === Date) {
                    if (thisAttribute === null && thatAttribute === null)
                        continue;

                    if ((thisAttribute === null && thatAttribute) || (thisAttribute && thatAttribute === null)) {
                        return false
                    }
                    else if (!moment(thisAttribute).isSame(thatAttribute)) {
                        return false;
                    }
                }
                else {
                    if (thisAttribute !== thatAttribute) {
                        return false;
                    }
                }

            }
        }
        for (const singularRelationshipName in this.instanceReferences) {
            if (this.instanceReferences[singularRelationshipName].id !== that.instanceReferences[singularRelationshipName].id) {
                return false;
            }
        }
        for (const nonSingularRelationshipName in this.instanceSetReferences) {
            const theseIds = this.instanceSetReferences[nonSingularRelationshipName].ids;
            const thoseIds = that.instanceSetReferences[nonSingularRelationshipName].ids;

            if (theseIds.length != thoseIds.length){
                return false;
            }
            for (const id of theseIds) {
                if (!thoseIds.includes(id))
                    return false;
            }

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

        const diffObject = {};
        const $set = {};
        const $unset = {};
        const $addToSet = {};
        const $pull = {};

        for (const attributeDefinition of this.classModel.attributes) {
            const thisAttribute = this.attributes[attributeDefinition.name];
            const thatAttribute = that !== null ? that.attributes[attributeDefinition.name] : null;
            let thisEmpty = thisAttribute === null;
            let thatEmpty = thatAttribute === null;

            
            if (attributeDefinition.list) {
                thisEmpty = thisEmpty || thisAttribute.length === 0;
                thatEmpty = thatEmpty || thatAttribute.length === 0;
            }

            if (thisEmpty && thatEmpty) {
                continue;
            }
            else if (thisEmpty && !thatEmpty) {
                $unset[attributeDefinition.name] = thatAttribute;
            }
            else if (!thisEmpty && thatEmpty) {
                $set[attributeDefinition.name] = thisAttribute;
            }
            else if (!thisEmpty && !thatEmpty) {
                if (!attributeDefinition.list) {
                    if (attributeDefinition.type === Date) {
                        if (!moment(thisAttribute).isSame(thatAttribute)) {
                            $set[attributeDefinition.name] = thisAttribute;
                        }
                    }
                    else {
                        if (thisAttribute !== thatAttribute) {
                            $set[attributeDefinition.name] = thisAttribute;
                        }
                    }
                }
                else {
                    if (thisAttribute.length !== thatAttribute.length) {
                        $set[attributeDefinition.name] = thisAttribute;
                    }
                    else {
                        for (const index in thisAttribute) {
                            if (attributeDefinition.type === Date) {
                                if (!moment(thisAttribute[index]).isSame(thatAttribute[index])) {
                                    $set[attributeDefinition.name] = thisAttribute;
                                    break;
                                }
                            }
                            else {
                                if (thisAttribute[index] !== thatAttribute[index]) {
                                    $set[attributeDefinition.name] = thisAttribute;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        for (const relationshipDefinition of this.classModel.relationships) {
            let thisRelationship, thatRelationship;
            if (relationshipDefinition.singular) {
                thisRelationship = this.instanceReferences[relationshipDefinition.name];
                thatRelationship = that !== null ? that.instanceReferences[relationshipDefinition.name] : null;
            }
            else { 
                thisRelationship = this.instanceSetReferences[relationshipDefinition.name];
                thatRelationship = that !== null ? that.instanceSetReferences[relationshipDefinition.name] : null;
            }

            const relationshipDiff = thisRelationship.diff(thatRelationship);

            if (relationshipDiff.$set) {
                $set[relationshipDefinition.name] = relationshipDiff.$set;
            }
            if (relationshipDiff.$unset) {
                $unset[relationshipDefinition.name] = relationshipDiff.$unset;
            }
            if (relationshipDiff.$addToSet) {
                if (relationshipDiff.$addToSet.length > 1) {
                    $addToSet[relationshipDefinition.name] = {
                        $each: relationshipDiff.$addToSet,
                    };
                }
                else {
                    $addToSet[relationshipDefinition.name] = relationshipDiff.$addToSet[0];
                }
            }
            if (relationshipDiff.$pull) {
                if (relationshipDiff.$pull.length > 1) {
                    $pull[relationshipDefinition.name] = {
                        $in: relationshipDiff.$pull,
                    };
                }
                else {
                    $pull[relationshipDefinition.name] = relationshipDiff.$pull[0];
                }
            }
        }


        if (Object.keys($set).length) {
            diffObject.$set = $set;
        }

        if (Object.keys($unset).length) {
            diffObject.$unset = $unset;
        }

        if (Object.keys($addToSet).length) {
            diffObject.$addToSet = $addToSet;
        }

        if (Object.keys($pull).length) {
            diffObject.$pull = $pull;
        }

        return diffObject;
    }

    diff2(that) {
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
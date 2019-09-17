require('@babel/polyfill');

class InstanceState {
    constructor(classModel, document) {
        this.attributes = {};
        this.instanceReferences = {};
        this.instanceSetReferences = {};


        for (const attribute of classModel.getAttributes()) {
            this.attributes[attribute.name] = document ? document[attribute.name] : null;
        }
        for (const singularRelationship of classModel.getSingularRelationships()) {
            instanceReference = new InstanceReference();
            if (document) 
                instanceReference.id = document[singularRelationship].id;
            this.instanceReferences[singularRelationship.name] = instanceReference;
        }
        for (const nonSingularRelationship of classModel.getNonSingularRelationships()) {
            instanceSetReference = new InstanceSetReference();
            if (document)
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
                    Reflect(trapTarget, key, receiver);
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

}

module.exports = InstanceState;
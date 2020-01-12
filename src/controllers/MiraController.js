const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;

function getClassModels() {
    return ClassModel.getAllClassModelNames();
}

function schemaForClassModel(className) {
    const classModel = ClassModel.getClassModel(className);

    if (classModel === undefined) {
        throw new Error('No ClassModel found with name "' + className + '".');
    }

    for (const attribute of classModel.attributes) {
        attribute.type = attribute.type.name;
    }

    return {
        attributes: classModel.attributes,
        relationships: classModel.relationships,
    };
}

async function put(data) {
    const instances = await parseDataToInstance(data);
    const result = [];

    for (const instance of instances) {
        const createdNewInstance = instance.saved() ? false : true;
        result.push({
            className: instance.classModel.className,
            id: instance.id,
            created: createdNewInstance,
        });
    }

    for (const instance of instances) {
        await instance.save();
    }

    return result;
}

async function parseDataToInstance(data) {
    putValidations(data);
    let instancesPut = [];

    const classModel = ClassModel.getClassModel(data.className);

    let instance;

    if (data.id) {
        instance = await classModel.findById(noomman.ObjectId(data.id));
        if (instance === null) {
            throw new Error('Could not find instance of ' + data.className + ' with id ' + data.id);
        }
    }
    else {
        instance = new Instance(classModel);
    }

    instancesPut.push(instance);

    for (const relationship of classModel.relationships) {
        const cardinality = classModel.cardinalityOfRelationship(relationship.name);
        if (data[relationship.name]) {
            const toClass = ClassModel.getClassModel(relationship.toClass);
            
            if (relationship.singular) {
                let relatedInstance;
                if (typeof(data[relationship.name]) === 'string') {
                    const id = new noomman.ObjectId(data[relationship.name]);
                    relatedInstance = await toClass.findById(id);
                    if (relatedInstance === null) {
                        throw new Error('Invalid id "' + id + '" supplied for relationship "' + relationship.name + '".');
                    }
                }
                else if (typeof(data[relationship.name]) === 'object') {
                    const recursiveInstances = await parseDataToInstance(data[relationship.name]);
                    instancesPut = instancesPut.concat(recursiveInstances);
                    relatedInstance = recursiveInstances[0];
                }
                    
                if (cardinality.from === '1') {
                    relatedInstance[relationship.mirrorRelationship] = instance;
                }
                else {
                    const reverseRelationship = (await relatedInstance[relationship.mirrorRelationship]);
                    reverseRelationship.add(instance);
                    relatedInstance[relationship.mirrorRelationship] = reverseRelationship;
                }

                data[relationship.name] = relatedInstance;
            }
            else {
                const relatedInstanceSet = new InstanceSet(toClass);
                for (const index in data[relationship.name]) {
                    let relatedInstance;
                    const idOrInstance = data[relationship.name][index];
                    if (typeof(idOrInstance) === 'string') {
                        const id = new noomman.ObjectId(idOrInstance);
                        relatedInstance = await toClass.findById(id);
                        if (relatedInstance === null) {
                            throw new Error('Invalid id "' + id + '" supplied for relationship "' + relationship.name + '".');
                        }
                    }
                    else if (typeof(idOrInstance) === 'object') {
                        const recursiveInstances = await parseDataToInstance(idOrInstance);
                        instancesPut = instancesPut.concat(recursiveInstances);
                        relatedInstance = recursiveInstances[0];
                    }
                    
                    if (cardinality.from === '1') {
                        relatedInstance[relationship.mirrorRelationship] = instance;
                    }
                    else {
                        (await relatedInstance[relationship.mirrorRelationship]).add(instance);
                    }

                    relatedInstanceSet.add(relatedInstance);
                }
                data[relationship.name] = relatedInstanceSet;
            }
        }
    }

    instance.assign(data);

    return instancesPut;
}

function putValidations(data) {
    if (!data) {
        throw new Error('No data given.');
    }

    if (!data.className) {
        throw new Error('Given data has no className property.');
    }
    if (ClassModel.getClassModel(data.className) == undefined) {
        throw new Error('No ClassModel found with name ' + data.className + '.');
    }
}

function get(query) {

}

module.exports = {
    getClassModels,
    schemaForClassModel,
    put,
    get,
}
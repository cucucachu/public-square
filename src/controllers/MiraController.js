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
    putValidations(data);
    const isntancesPut = [];

    const classModel = ClassModel.getClassModel(data.className);

    let instance;
    if (data.id) {
        instance = await classModel.findById(data.id);
        if (instance === null) {
            throw new Error('Could not find instance of ' + data.className + ' with id ' + data.id);
        }
    }
    else {
        instance = new Instance(classModel);
    }

    const relationshipNames = classModel.relationships.map(r => r.name);

    for (const relationship of classModel.relationships) {
        if (data[relationship.name]) {
            const toClass = ClassModel.getClassModel(relationship.toClass);
            if (relationship.singular) {
                if (typeof(data[relationship.name]) === 'string') {
                    const id = new noomman.ObjectId(data[relationship.name]);
                    const relatedInstance = await toClass.findById(id);
                    data[relationship.name] = relatedInstance;
                }
                else {

                }
            }
            else {
                const relatedInstanceSet = new InstanceSet(toClass);
                for (const index in data[relationship.name]) {
                    const idOrInstance = data[relationship.name][index];
                    if (typeof(idOrInstance) === 'string') {
                        const id = new noomman.ObjectId(idOrInstance);
                        const relatedInstance = await toClass.findById(id);
                        relatedInstanceSet.add(relatedInstance);
                    }
                    else {
                    }

                }
                data[relationship.name] = relatedInstanceSet;
            }
        }
    }

    instance.assign(data);

    await instance.save();

    isntancesPut.push(instance);

    return isntancesPut;
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
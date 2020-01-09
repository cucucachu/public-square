const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Instance = noomman.Instance;

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

    instance.assign(data);

    await instance.save();
}

function putValidations(data) {
    if (!data.className) {
        throw new Error('Given data has no className property.');
    }
    if (ClassModel.getClassModel(data.className) == undefined) {
        throw new Error('No ClassModel found with name ' + data.className);
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
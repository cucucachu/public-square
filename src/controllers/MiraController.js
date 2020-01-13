const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;

/* 
 * getClassModels() 
 * Description: Returns the names of all ClassModels created with noomman.
 * Returns: 
 *  - Array<String> - All classNames of all ClassModels created with noomman. 
 */
function getClassModels() {
    return ClassModel.getAllClassModelNames();
}

/* 
 * schemaForClassModel(className) 
 * Parameters:
 * - className - String - The className of a noomman ClassModel.
 * Description: Returns the attributes and relationships for the ClassModel witht the given className.
 * Returns: 
 *  - Object - An Object with two array properties called 'attributes' and 'relationships', containing the
 *    attributes and relationships for the ClassModel with the given className.
 */
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

/* 
 * put(data) 
 * Parameters:
 * - data - Object - An Object containing the data to put. Instances are represented with objects containing
 *    a 'className' property representing the ClassModel of the instance, and 'id' property which is the 
 *    String representation of the ObjectId for the instance (if it is an existing instance), and the attribute
 *    and relationship values to set for the instance. Relationships can be set to values of string representation
 *    of the ObjectIds of those related instances, or a nested data object following the same conventions as this object.
 * Description: Creates or updates instances according to the given data. 
 * Returns: 
 *  - Array<Object> - An array containing objects, each object representing an instance that was updated or created by this
 *    put call. Each object in the array has 'className' property for the ClassModel of the instance, an 'id' property for the
 *    string representation of the ObjectId of the instance, and a boolean 'created', which is true if the instance was newly 
 *    created, and false if an existing instance was updated.
 * Throws: 
 * - Error - If putValidations() throws an Error due to the given data being invalid. 
 */
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

/* 
 * parseDataToInstance(data) 
 * Parameters:
 * - data - Object - See put().
 * Description: Recursively creates or retrieves instances referenced in the given data. Assigns attributes and relationships
 *    for those instances according to the given data. Returns all instances created or retrieved in an Array, in depth-first
 *    order according to the given data.
 * Returns: 
 *  - Array<Instances> - An array containing Instances created or retrieved, and with the changes given in the data object, 
 *    in depth-first order.
 * Throws: 
 * - Error - If putValidations() throws an Error due to the given data being invalid. 
 */
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

    // Set relationships according to given data and recursively 
    // create or edit related instances as necessary.
    for (const property of Object.keys(data)) {
        if (classModel.relationships.map(r => r.name).includes(property)) {
            const relationship = classModel.relationships.filter(r => r.name === property)[0];
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
    }
    
    // Delete any attributes marked 'MiraDelete'
    for (const property of Object.keys(data)) {
        if (classModel.attributes.map(a => a.name).includes(property)) {
            if (data[property] === 'MiraDelete') {
                delete instance[property];
                delete data[property];
            } 
        }
    }

    instance.assign(data);

    return instancesPut;
}

/* 
 * putValidations(data) 
 * Parameters:
 * - data - Object - See put().
 * Description: Validateds for a single layer of given data that data is not null or undefined, and has a valid 
 *    className matching a noomman ClassModel.
 * Throws: 
 * - Error - If data is null or undefined.
 * - Error - If 'className' property is ommitted.
 * - Error - If 'className' does not match a noomman ClassModel.
 */
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

/* 
 * get(data) 
 * Parameters:
 * - request - Object - An Object which defines the Instance to get. Object must have properties 'className' and 'id', indicating
 *    the Instance to get. Can have addition properties matching relationship names. If supplied the instances in those relationships
 *    will be returned with their attributes and relationships populated as well. Can nest the relationship properties to recursively
 *    get the instances through many relationships.
 * Returns: 
 *  - Object - An object with 'className', 'id', and attributes and relationships for the requested Instance. Instances in relationships
 *    may also have their attributes and relationships if requested.
 * Throws: 
 * - Error - If getValidations() throws an Error due to the given request being invalid. 
 */
async function get(request) {
    getValidations(request);
    const classModel = ClassModel.getClassModel(request.className);
    const _id = noomman.ObjectId(request.id);

    const instance = await classModel.findById(_id);

    if (instance === null) {
        throw new Error('Cannot find instance of "' + request.className + '" with id "' + request.id + '".');
    }

    const strippedRequest = {};
    Object.assign(strippedRequest, request);

    delete strippedRequest.className;
    delete strippedRequest.id;

    return formatInstanceForGetRequest(instance, strippedRequest);
}

async function formatInstanceForGetRequest(instance, request) {
    const response = {};

    response.className = instance.classModel.className;
    response.id = instance.id;
    response.displayAs = instance.displayAs !== undefined ? instance.displayAs() : instance.classModel.className + ': ' + instance.id;

    for (const attribute of instance.classModel.attributes) {
        response[attribute.name] = instance[attribute.name];
    }

    for (const relationship of instance.classModel.relationships) {
        const recursive = typeof(request) === 'object' && Object.keys(request).includes(relationship.name);
        if (relationship.singular) {
            const relatedInstance = await instance[relationship.name];
            if (relatedInstance === null) {
                response[relationship.name] = null;
            }
            else {
                if (recursive) { 
                    response[relationship.name] = await formatInstanceForGetRequest(relatedInstance, request[relationship.name]);
                }
                else {
                    response[relationship.name] = {
                        className: relatedInstance.classModel.className,
                        id: relatedInstance.id,
                        displayAs: relatedInstance.displayAs !== undefined ? 
                            relatedInstance.displayAs() : 
                            relatedInstance.classModel.className + ': ' + relatedInstance.id,
                    }
                }
            }
        }
        else {
            const relatedInstances = await instance[relationship.name];
            response[relationship.name] = [];
            for (const relatedInstance of relatedInstances) {
                if (recursive) { 
                    response[relationship.name].push(await formatInstanceForGetRequest(relatedInstance, request[relationship.name]));
                }
                else {
                    response[relationship.name].push({
                        className: relatedInstance.classModel.className,
                        id: relatedInstance.id,
                        displayAs: relatedInstance.displayAs !== undefined ? 
                            relatedInstance.displayAs() : 
                            relatedInstance.classModel.className + ': ' + relatedInstance.id,
                    });
                }
            }
        }
    }

    return response;
}

function getValidations(request) {
    if (!request) {
        throw new Error('No request given.');
    }

    if (!request.className) {
        throw new Error('Given request has no className property.');
    }

    if (!request.id) {
        throw new Error('Given request has no id property.');
    }

    if (ClassModel.getClassModel(request.className) == undefined) {
        throw new Error('No ClassModel found with name ' + request.className + '.');
    }    

    try {
        noomman.ObjectId(request.id);
    }
    catch (error) {
        throw new Error('Given request contains invalid id: "' + request.id + '".');
    }
}

module.exports = {
    getClassModels,
    schemaForClassModel,
    put,
    get,
}
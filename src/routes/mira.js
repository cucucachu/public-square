const express = require('express');
const router = express.Router();

const MiraController = require('../controllers/MiraController');

/* 
 * /
 * Returns the names of all ClassModels.
 * Response:
 *  JSON - An Array containing the names of all the ClassModels.
 */
router.get('/', (request, response) => {
    try {
        response.json(MiraController.getClassModels());
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

/* 
 * /:className
 * Returns the attributes and relationships for the ClassModel with the given className.
 * Response: 
 * - JSON - An object with properties 'attributes' and 'relationships'. Each property is an
 *    array of nested objects containing the details of each attribute and relationship for the
 *    requested ClassModel.
 */
router.get('/:className', (request, response) => {
    let schema;
    try {
           schema = MiraController.schemaForClassModel(request.params.className);
           response.json(schema);
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

/* 
 * /get
 * Returns a single instance.
 * RequestBody: 
 * - className - String - The className of the ClassModel of the instance.
 * - id - String - The Id of the instance to get.
 * - <relationshipName> - Boolean|Object - Setting a property in the request body 
 *    with the same name as a relationship on the instance will have all 
 *    the instances related through this relationship returned with all their data as well.
 *    This can be done recursively to return instances related through many layers of related 
 *    instances.
 * Response: 
 * - JSON - An object containing the requested instance's 'className', 'id', and attribute and relationship
 *    values.
 */
router.post('/get', async (request, response) => {
    try {
        const instance = await MiraController.get(request.body);
        response.json(instance);
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

/* 
 * /getInstances
 * Returns a page of instances matching the given 'filter' in the given 'order'.
 * RequestBody: 
 * - className - String - The className of the ClassModel of the instance.
 * - filter - Object - A valid mongodb filter object.
 * - page - Number - The page requested. Page 0 is the first page.
 * - pageSize - Number - The number of instances returned per page.
 * - orderBy - String|Array|Object - Indicates the desired order of the returned instances.
 * Response: 
 * - JSON - Object -
 * -- instances - Array<Instance> An array containing instances matching query.
 * -- page - Number - The requested page number.
 * -- pageSize - Number - The number of instances per page.
 * -- hiddenInstances - Number - The number of instances which matched the query but
 *       were ommitted due to read control filtering.
 * -- totalNumberOfInstances - Number - The number of instances matching the query in the database. * 
 */
router.post('/getInstances', async (request, response) => {
    try {
        const data = request.body;
        const instances = await MiraController.getInstances(
            data.className, data.filter, data.page, data.pageSize, data.orderBy
        );
        response.json(instances);
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

/* 
 * /put
 * Creates or updates existing instance(s) according to the request.
 * RequestBody: 
 * - className - String - The className of the ClassModel of the instance to create or update.
 * - id - String - The id of the instance to update. If null or undefined, a new instance will be
 *    created.
 * - <attribute> - Include propteries with keys equal to attribute names for the ClassModel, and 
 *    values equal to the value to set for that attribute.
 * - <relationship> - Include properties with keys equal to relationship names, and values equal to
 *    an id for setting a singular relationship to an existing instance, an array of ids to set a 
 *    non-singular relationship to existing instances, a nested object following top-level schema 
 *    to create a new instance for a singular relationship, or an array of objects to set a non-
 *    singular relationship to a set of new instances.
 * Response: 
 * - JSON - Array - An array containing an object for each Instance that was updated or created. The 
 *    objects in the array contain 'className', 'id', and 'created' properties.
 */
router.post('/put', async (request, response) => {
    try {
        const result = await MiraController.put(request.body);
        response.json({
            status: 'successful',
            result,
        });
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});


/* 
 * /delete
 * Deletes an instance of the given ClassModel and with the given id.
 * RequestBody: 
 * - className - String - The className of the ClassModel of the instance delete.
 * - id - String - The id of the instance to delete.
 * Response: 
 * - JSON - Object - An Object with properties'className', 'id', and 'deleted'. 'deleted 
 *    indicates whether the instance was deleted successfully.
 */
router.post('/delete', async (request, response) => {
    try {
        const result = await MiraController.deleteInstance(request.body);
        response.json({
            className: request.body.className,
            id: request.body.id,
            deleted: result,
        });
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;

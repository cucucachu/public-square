const express = require('express');
const router = express.Router();

const MiraController = require('../controllers/MiraController');

router.get('/schema', (request, response) => {
    try {
        response.json(MiraController.getClassModels());
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.get('/schema/:className', (request, response) => {
    let schema;
    try {
           schema = MiraController.schemaForClassModel(request.params.className);
           response.json(schema);
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/get', async (request, response) => {
    const instance = await MiraController.get(request.body);
    response.json(instance);
});

router.post('/getInstances', async (request, response) => {
    const data = request.body;
    const instances = await MiraController.getInstances(
        data.className, data.filter, data.page, data.pageSize, data.orderBy
    );
    response.json(instances);
});

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

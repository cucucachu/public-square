const express = require('express');
const router = express.Router();

const miraController = require('../controllers/miraController');

router.get('/schema', (request, response) => {
    try {
        response.json(miraController.getClassModels());
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.get('/schema/:className', (request, response, next) => {
    let schema;
    try {
           schema = miraController.schemaForClassModel(request.params.className);
           response.json(schema);
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/', async (request, response) => {
    try {
        await miraController.put(request.body);
        response.json({
            status: 'successful',
        });
    }
    catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;

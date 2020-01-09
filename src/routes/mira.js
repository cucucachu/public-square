var express = require('express');
var router = express.Router();

router.get('/schema/:className', function(request, response, next) {
    const className = request.params.className;
    
	response.json(request.user);
});

module.exports = router;

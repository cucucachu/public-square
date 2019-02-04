var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tokenTest', function(request, response, next) {
	response.json(request.user);
});

module.exports = router;

var express = require('express');
var router = express.Router();
var userModelTests = require('../tests/UserModelTests');

/* GET home page. */
router.get('/userModelTest/', function(req, res, next) {
	var testResults = userModelTests.testUserModel();

	res.render('testing', testResults);
});

module.exports = router;

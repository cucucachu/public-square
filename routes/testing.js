var express = require('express');
var router = express.Router();
var userModelTests = require('../tests/UserModelTests');

/* GET home page. */
router.get('/userModelTest/', function(req, res, next) {
	var testResults = {};
	userModelTests.testUserModel().then(
		function(testResults) {
			res.render('testing', testResults);
		},
		function(err) {
			console.error(err);
		}
	);

});

module.exports = router;

var userModel = require('../models/user');
var testUtilities = require('./TestUtilities');

exports.testUserModel = function() {
	var firstName = testUtilities.randomString(7);
	var middleName = testUtilities.randomString(7);
	var lastName = testUtilities.randomString(7);
	var testResults = [];

	return new Promise(function(resolve, reject) {
		testFindOneUser().then(
			function(testResult) {
				testResults.push(testResult);

				resolve({
					testSuiteName: 'User Model Tests',
					testResults: testResults
				});
			},
			function(err) {
				reject(err);
			}
		);
	});
}

var testFindOneUser = function() {
	return new Promise(function(resolve, reject) {	
		var testResult = {};

		var dummyFreddySpaghetti = {
			firstName: 'Freddy',
			middleName: 'Many',
			lastName: 'Spaghetti'
		};

		userModel.User.findOne({firstName: 'Freddy', middleName: 'Many', lastName: 'Spaghetti'}, function(err, user) {
			testResult = userModel.compareUsers(user, dummyFreddySpaghetti);
			
			if (err) {
				console.error(err);
				reject(err);
			}
			else {
				resolve({
					name: 'Find One User Test',
					result: testResult
				});
			}
		});

	});
}
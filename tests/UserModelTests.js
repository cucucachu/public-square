var userModel = require('../models/user');
var testUtilities = require('./TestUtilities');

exports.testUserModel = function() {
	var dummyFreddySpaghetti = {
		firstName: 'Freddy',
		middleName: 'Many',
		lastName: 'Spaghetti'
	};
	var testResults = [];

	return new Promise(function(resolve, reject) {
		testFindOneUser(dummyFreddySpaghetti).then(
			function(testResult) {
				testResults.push(testResult);

				testCreateUser().then(
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
			},
			function(err) {
				reject(err);
			}
		);
	});
}

var testFindOneUser = function(userToFind) {
	return new Promise(function(resolve, reject) {	
		var testResult = {};

		userModel.User.findOne({firstName: userToFind.firstName, middleName: userToFind.middleName, lastName: userToFind.lastName}, function(err, user) {
			testResult = userModel.compareUsers(user, userToFind);
			
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

var testCreateUser = function() {
	return new Promise(function(resolve, reject){
		var testResult;

		var firstName = testUtilities.randomString(7);
		var middleName = testUtilities.randomString(7);
		var lastName = testUtilities.randomString(7);

		var user = userModel.createUser();

		user.firstName = firstName;
		user.middleName = middleName;
		user.lastName = lastName;


		userModel.saveUser(user, 'testCreate user error', 'Test Create User Success').then(
			function(savedUser) {
				userModel.User.findOne({
					firstName: firstName,
					middleName: middleName,
					lastName: lastName
				}, function(err, foundUser) {
					if (err)
						reject(err);
					else {
						testResult = userModel.compareUsers(user, foundUser)
						resolve({
							name: 'Create and Find User Test',
							result: testResult
						});
					}
				});
			},
			function(err) {
				reject(err);
			}
		);
	});
}

var userModel = require('../models/user');
var testUtilities = require('./TestUtilities');

exports.testUserModel = function() {
	var firstName = testUtilities.randomString(7);
	var middleName = testUtilities.randomString(7);
	var lastName = testUtilities.randomString(7);
	var testResults = [];

	testFindOneUser().then(function(testResult) {
		
	});

	// freddySpaghetti = userModel.findOneUserByName('Feddy', null, 'Spaghetti');

	// testResult = userModel.compareUsers(freddySpaghetti, dummyFreddySpaghetti);

	// testResults.push({
	// 	name: 'Find One User by Name Test 2',
	// 	result: testResult
	// });

	// var dummyUser = {
	// 	firstName: firstName, 
	// 	middleName: middleName, 
	// 	lastName: lastName
	// };

	// userModel.createUser(firstName, middleName, lastName);

	// var realUser = userModel.findOneUserByName(firstName, middleName, lastName);

	// testResult = userModel.compareUsers(realUser, dummyUser);

	// testResults.push({
	// 	name: "Create User Test",
	// 	result: testResult
	// });
	console.log('returning');

	return {
		testSuiteName: 'User Model Tests',
		testResults: testResults
	};
}

var testFindOneUser = function() {
	return new Promise(function(resulve, reject) {	
		var dummyFreddySpaghetti = {
			firstName: 'Freddy',
			middleName: 'Many',
			lastName: 'Spaghetti'
		};

		userModel.findOneUserByName('Freddy', 'Many', 'Spaghetti').then(function(freddySpaghetti){
			console.log(freddySpaghetti);
			testResult = userModel.compareUsers(freddySpaghetti, dummyFreddySpaghetti);

			testResults.push({
				name: 'Find One User by Name Test 1',
				result: testResult
			});
			console.log('pushing to array');

			resolve(testResult)
		}, function({
				name: 'Find One User by Name Test 1',
				result: testResult
			})

		});

	});
}
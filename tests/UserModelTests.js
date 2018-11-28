var UserModel = require('../models/user');
var UserAccountModel = require('../models/userAccount');
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

						testCreateUserAndUserAccount().then(
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

		UserModel.User.findOne({firstName: userToFind.firstName, middleName: userToFind.middleName, lastName: userToFind.lastName}, function(err, user) {
			testResult = UserModel.compareUsers(user, userToFind);
			
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

		var user = UserModel.createUser();

		user.firstName = firstName;
		user.middleName = middleName;
		user.lastName = lastName;


		UserModel.saveUser(user, 'testCreate user error', 'Test Create User Success').then(
			function(savedUser) {
				UserModel.User.findOne({
					firstName: firstName,
					middleName: middleName,
					lastName: lastName
				}, function(err, foundUser) {
					if (err)
						reject(err);
					else {
						testResult = UserModel.compareUsers(user, foundUser)
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

var testCreateUserAndUserAccount = function() {
	var testResults;

	var firstName = testUtilities.randomString(7);
	var middleName = testUtilities.randomString(7);
	var lastName = testUtilities.randomString(7);

	var email = firstName + '@' + testUtilities.randomString(5) + '.com';
	var passwordHash = testUtilities.randomString(15);


	return new Promise( function(resolve, reject) {
		var newUserAndUserAccount = UserAccountModel.createUserAndUserAccount();
		var newUser = newUserAndUserAccount.user;
		var newUserAccount = newUserAndUserAccount.userAccount;

		// Set user attributes
		newUser.firstName = firstName;
		newUser.middleName = middleName;
		newUser.lastName = lastName;

		// Set user account attributes
		newUserAccount.email = email;
		newUserAccount.passwordHash = passwordHash;

		UserModel.saveUser(newUser).then(
			function(savedUser) {
				UserAccountModel.saveUserAccount(newUserAccount).then(
					function(savedUserAccount) {
						resolve({
							name: 'Create User and User Account Test',
							result: {
								match: true,
								message: 'passed'
							}
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

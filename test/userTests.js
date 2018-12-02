var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var userModel = require('../models/user');
var userAccountModel = require('../models/userAccount');
var userRoleModel = require('../models/userRole')

describe('User Model Tests', function() {
	before(function(done) {
		userModel.clear().then(function() {
			userAccountModel.clear().then(done, done)
		}, done);;
	});

	before(function(done) {
		userAccountModel.clear().then(done, done);
	});


	// User Class - models/user.js


	describe('User Model', function(){	
		
		describe('userModel.createUser()', function() {
		
			it('createUser creates a user instance.', function() {
				var user = userModel.createUser();
				assert(typeof(user) === "object");
			});

			it('createUser creates a user instance with _id field populated', function(){
				var user = userModel.createUser();
				assert(typeof(user._id) === "object" && /^[a-f\d]{24}$/i.test(user._id));
			});
		});

		describe('userModel.saveUser()', function() {

			it('Required fields validation', function(done) {
				var user = userModel.createUser();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'User validation failed: userAccount: Path `userAccount` is required., lastName: Path `lastName` is required., middleName: Path `middleName` is required., firstName: Path `firstName` is required.';

				userModel.saveUser(user).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('userModel.saveUser() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'userModel.saveUser() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});


			it('userModel.UserAccount must be a valid ID', function(done){
				var user = userModel.createUser();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='User validation failed: userAccount: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "userAccount"';

				user.firstName = 'firstName';
				user.middleName = 'middleName';
				user.lastName = 'lastName';

				user.userAccount = 'asdf1234zyxw9876';

				userModel.saveUser(user).then(
					function(savedUser) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('userModel.saveUser() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'userModel.saveUser() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves user', function(done){
				var user = userModel.createUser();
				var err = null;

				user.firstName = 'firstName';
				user.middleName = 'middleName';
				user.lastName = 'lastName';

				user.userAccount = userAccountModel.createUserAccount()._id;

				userModel.saveUser(user).then(
					function(savedUser) {
						userModel.User.findOne({_id: savedUser._id}, function(findErr, foundUser) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = userModel.compareUsers(user, foundUser);						
								if (compareResult.match == false) {
									err = new Error(compareResult.message);
								}
							}
						});
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if (err) {
						done(err);
					}
					else {
						done();
					}
				});
			});

		});

	});


	// User Class - models/user.js


	describe('User Account Model', function() {

		describe('userAccountModel.createUserAccount()', function() {

			it('createUserAccount creates a userAccount instance', function() {
				var userAccount = userAccountModel.createUserAccount();
				assert(typeof(userAccount) === "object");
			});

			it('createUserAccount creates a userAccount instance with _id field populated', function(){
				var userAccount = userAccountModel.createUserAccount();
				assert(typeof(userAccount._id) === "object" && /^[a-f\d]{24}$/i.test(userAccount._id));
			});

		});

		describe('userAccountModel.saveUserAccount()', function() {

			it('Required fields validation', function(done) {
				var userAccount = userAccountModel.createUserAccount();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'UserAccount validation failed: user: Path `user` is required., passwordHash: Path `passwordHash` is required., email: Path `email` is required.';

				userAccountModel.saveUserAccount(userAccount).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('userAccountModel.saveUserAccount() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'userAccountModel.saveUserAccount() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('userAccountModel.User must be a valid ID', function(done){
				var userAccount = userAccountModel.createUserAccount();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserAccount validation failed: user: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "user"';

				userAccount.email = 'email@domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

				userAccount.user = 'asdf1234zyxw9876';

				userAccountModel.saveUserAccount(userAccount).then(
					function(savedUserAccount) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('userAccountModel.saveUserAccount() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'userAccountModel.saveUserAccount() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('userAccountModel.email must be a valid email address', function(done){
				var userAccount = userAccountModel.createUserAccount();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserAccount validation failed: email: Invalid Email';

				userAccount.email = 'email.domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

				userAccount.user = userModel.createUser()._id;

				userAccountModel.saveUserAccount(userAccount).then(
					function(savedUserAccount) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('userAccountModel.saveUserAccount() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'userAccountModel.saveUserAccount() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves userAccount', function(done){
				var userAccount = userAccountModel.createUserAccount();
				var err = null;

				userAccount.email = 'email@domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
				userAccount.user = userModel.createUser()._id;

				userAccountModel.saveUserAccount(userAccount).then(
					function(savedUserAccount) {
						userAccountModel.UserAccount.findOne({_id: savedUserAccount._id}, function(findErr, foundUserAccount) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = userAccountModel.compareUserAccounts(userAccount, foundUserAccount);						
								if (compareResult.match == false) {
									err = new Error(compareResult.message);
								}
							}
						});
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if (err) {
						done(err);
					}
					else {
						done();
					}
				});
			});

		});

	});


	// User Role Class - models/userRole.js


	describe('User Role Model', function() {

		describe('userRoleModel.createUserRole()', function() {

			it('createUserRole creates a userRole instance', function() {
				var userRole = userRoleModel.createUserRole();
				assert(typeof(userRole) === "object");
			});

			it('createUserRole creates a userRole instance with _id field populated', function(){
				var userRole = userRoleModel.createUserRole();
				assert(typeof(userRole._id) === "object" && /^[a-f\d]{24}$/i.test(userRole._id));
			});

		});

		describe('userRoleModel.saveUserRole()', function() {

			it('Required fields validation', function(done) {
				var userRole = userRoleModel.createUserRole();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'UserRole validation failed: user: Path `user` is required.';

				userRoleModel.saveUserRole(userRole).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('userRoleModel.saveUserRole() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'userRoleModel.saveUserRole() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('userRoleModel.User() must be a valid ID', function(done){
				var userRole = userRoleModel.createUserRole();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserRole validation failed: user: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "user"';

				userRole.user = 'asdf1234zyxw9876';

				userRoleModel.saveUserRole(userRole).then(
					function(savedUserRole) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('userRoleModel.saveUserRole() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'userRoleModel.saveUserRole did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves userRole', function(done){
				var userRole = userRoleModel.createUserRole();
				var err = null;

				userRole.user = userModel.createUser()._id;

				userRoleModel.saveUserRole(userRole).then(
					function(savedUserRole) {
						userRoleModel.UserRole.findOne({_id: savedUserRole._id}, function(findErr, foundUserRole) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = userRoleModel.compareUserRoles(userRole, foundUserRole);						
								if (compareResult.match == false) {
									err = new Error(compareResult.message);
								}
							}
						});
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if (err) {
						done(err);
					}
					else {
						done();
					}
				});
			});

		});

	});


	// User, UserAccount, and UserRole Graph Interactions
	describe('User Graph Interactions', function() {

		describe('Creating and Saving Users, UserAccounts, and UserRoles', function() {

			describe('userAccountModel.createUserAndUserAccount()', function() {

				it('userAccountModel.createUserAndUserAccount() creates and returns 2 instances referencing each other.', function() {
					var userAndUserAccount = userAccountModel.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					assert(user.userAccount == userAccount._id);
					assert(userAccount.user == user._id);
				});

			});

			describe('userAccountModel.saveUserAndUserAccount()', function() {
				
				it ('userAccountModel.saveUserAndUserAccount() saves both instances.', function(done) {
					var testFailed = 0;
					var err = null;

					var userAndUserAccount = userAccountModel.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					user.firstName = 'firstName';
					user.middleName = 'middleName';
					user.lastName = 'lastName';

					userAccount.email = 'email@domain.com';
					userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

					userAccountModel.saveUserAndUserAccount(user, userAccount).then(
						function() {
							userModel.User.findById(user._id, function(findErr, foundUser) {
								if (findErr) {
									testFailed = 1;
									err = findErr;
								}
								else {
									var compareResult = userModel.compareUsers(user, foundUser);
									if (compareResult.match == false) {
										testFailed = 1;
										err = new Error (compareResult.message);
									}
								}
							});
						},
						function(saveError) {
							err = saveErr;
							testFailed = 1;
						}
					).finally(function() {
						if (testFailed) {
							done(err);
						}
						else {
							done();
						}
					});

				});

			});

		});

	});
});
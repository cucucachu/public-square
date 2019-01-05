var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

require('../models/Modules/User/UserModule');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var User = require('../models/Modules/User/User');
var UserAccount = require('../models/Modules/User/UserAccount');
var UserRole = require('../models/Modules/User/UserRole');

describe('User Module Tests', function() {
	
	before(function(done) {
		User.clear().then(
			function() {
				UserAccount.clear().then(
					function() {
						UserRole.clear().then(done, done);
					}, 
					done
				);
			}, 
			done
		);
	});


	// User Class - models/user.js


	describe('User Model', function(){	
		
		describe('User.create()', function() {
		
			it('create() creates a user instance.', function() {
				var user = User.create();
				assert(typeof(user) === "object");
			});

			it('create() creates a user instance with _id field populated', function(){
				var user = User.create();
				assert(typeof(user._id) === "object" && /^[a-f\d]{24}$/i.test(user._id));
			});
		});

		describe('User.save()', function() {

			it('Required fields validation', function(done) {
				var user = User.create();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'User validation failed: userAccount: Path `userAccount` is required., lastName: Path `lastName` is required., middleName: Path `middleName` is required., firstName: Path `firstName` is required.';

				User.save(user).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('User.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'User.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});


			it('User.UserAccount must be a valid ID', function(done){
				var user = User.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='User validation failed: userAccount: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "userAccount"';

				user.firstName = 'firstName';
				user.middleName = 'middleName';
				user.lastName = 'lastName';

				user.userAccount = 'asdf1234zyxw9876';

				User.save(user).then(
					function(savedUser) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('User.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'User.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves user', function(done){
				var user = User.create();
				var err = null;

				user.firstName = 'firstName';
				user.middleName = 'middleName';
				user.lastName = 'lastName';

				user.userAccount = UserAccount.create()._id;

				User.save(user).then(
					function(savedUser) {
						User.Model.findOne({_id: savedUser._id}, function(findErr, foundUser) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = User.compare(user, foundUser);						
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

		describe('UserAccount.create()', function() {

			it('create() creates a userAccount instance', function() {
				var userAccount = UserAccount.create();
				assert(typeof(userAccount) === "object");
			});

			it('create() creates a userAccount instance with _id field populated', function(){
				var userAccount = UserAccount.create();
				assert(typeof(userAccount._id) === "object" && /^[a-f\d]{24}$/i.test(userAccount._id));
			});

		});

		describe('UserAccount.save()', function() {

			it('Required fields validation', function(done) {
				var userAccount = UserAccount.create();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'UserAccount validation failed: user: Path `user` is required., passwordHash: Path `passwordHash` is required., email: Path `email` is required.';

				UserAccount.save(userAccount).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'UserAccount.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('UserAccount.User must be a valid ID', function(done){
				var userAccount = UserAccount.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserAccount validation failed: user: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "user"';

				userAccount.email = 'email@domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

				userAccount.user = 'asdf1234zyxw9876';

				UserAccount.save(userAccount).then(
					function(savedUserAccount) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserAccount.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('UserAccount.email must be a valid email address', function(done){
				var userAccount = UserAccount.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserAccount validation failed: email: Invalid Email';

				userAccount.email = 'email.domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

				userAccount.user = User.create()._id;

				UserAccount.save(userAccount).then(
					function(savedUserAccount) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserAccount.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves userAccount', function(done){
				var userAccount = UserAccount.create();
				var err = null;

				userAccount.email = 'email@domain.com';
				userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
				userAccount.user = User.create()._id;

				UserAccount.save(userAccount).then(
					function(savedUserAccount) {
						UserAccount.Model.findOne({_id: savedUserAccount._id}, function(findErr, foundUserAccount) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = UserAccount.compare(userAccount, foundUserAccount);						
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

		describe('UserRole.create()', function() {

			it('create() creates a userRole instance', function() {
				var userRole = UserRole.create();
				assert(typeof(userRole) === "object");
			});

			it('create() creates a userRole instance with _id field populated', function(){
				var userRole = UserRole.create();
				assert(typeof(userRole._id) === "object" && /^[a-f\d]{24}$/i.test(userRole._id));
			});

		});

		describe('UserRole.save()', function() {

			it('Required fields validation', function(done) {
				var userRole = UserRole.create();
				var testFailed = 0;
				var err;
				var expectedErrorMessage = 'UserRole validation failed: user: Path `user` is required.';

				UserRole.save(userRole).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						err = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('UserRole.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'UserRole.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('UserRole.User() must be a valid ID', function(done){
				var userRole = UserRole.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserRole validation failed: user: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "user"';

				userRole.user = 'asdf1234zyxw9876';

				UserRole.save(userRole).then(
					function(savedUserRole) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('UserRole.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserRole.saveUserRole did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});

			it('Valid call saves userRole', function(done){
				var userRole = UserRole.create();
				var err = null;

				userRole.user = User.create()._id;

				UserRole.save(userRole).then(
					function(savedUserRole) {
						UserRole.Model.findOne({_id: savedUserRole._id}, function(findErr, foundUserRole) {
							if (findErr) {
								err = findErr;
							}
							else {
								var compareResult = UserRole.compare(userRole, foundUserRole);						
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

			describe('UserAccount.createUserAndUserAccount()', function() {

				it('UserAccount.createUserAndUserAccount() creates and returns 2 instances referencing each other.', function() {
					var userAndUserAccount = UserAccount.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					assert(user.userAccount == userAccount._id);
					assert(userAccount.user == user._id);
				});

			});

			describe('UserAccount.saveUserAndUserAccount()', function() {
				
				it ('UserAccount.saveUserAndUserAccount() saves both instances.', function(done) {
					var testFailed = 0;
					var err = null;

					var userAndUserAccount = UserAccount.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					user.firstName = 'firstName';
					user.middleName = 'middleName';
					user.lastName = 'lastName';

					userAccount.email = 'email@domain.com';
					userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

					UserAccount.saveUserAndUserAccount(user, userAccount).then(
						function() {
							User.Model.findById(user._id, function(findErr, foundUser) {
								if (findErr) {
									testFailed = 1;
									err = findErr;
								}
								else {
									var compareResult = User.compare(user, foundUser);
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

			describe('User.addUserRoletoUser()', function() {
				
				it('Adds user Role to existing User with no current Roles', function(done) {
					var testFailed = 0;
					var err = null;

					var userAndUserAccount = UserAccount.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					user.firstName = 'firstName';
					user.middleName = 'middleName';
					user.lastName = 'lastName';

					userAccount.email = 'email@domain.com';
					userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

					UserAccount.saveUserAndUserAccount(user, userAccount).then(
						function() {
							userRole = UserRole.create();

							User.addUserRoletoUser(user, userRole).then(
								function() {
									User.Model.findById(user._id, function(findError, foundUser) {
										if (findError) {
											testFailed = 1;
											err = findError;
										}
										else {
											if (foundUser.userRoles.length != 1 && foundUser.userRoles.indexOf(userRole._id) == -1) {
												testFailed = 1;
												err = new Error('User saved to database does not have the correct UserRole.');
											}
											else {
												UserRole.userRole.findById(userRole._id, function(findError, foundUserRole) {
													if (findError) {
														testFailed = 1;
														err = findError;
													}
													else {
														if (foundUserRole.user != user._id) {
															testFailed = 1;
															err = new Error('UserRole saved to database does not have the correct User.')
														}
													}
												});
											}
										}
									});
								},
								function(addError) {
									err = addError;
									testFailed = 1;
								}
							);
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

				it('If User already has UserRole, UserRole is not added again.', function(done) {
					var testFailed = 0;
					var err = null;

					var userAndUserAccount = UserAccount.createUserAndUserAccount();
					var user = userAndUserAccount.user;
					var userAccount = userAndUserAccount.userAccount;

					user.firstName = 'firstName';
					user.middleName = 'middleName';
					user.lastName = 'lastName';

					userAccount.email = 'email@domain.com';
					userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';

					UserAccount.saveUserAndUserAccount(user, userAccount).then(
						function() {
							userRole = UserRole.create();

							user.userRoles.push(userRole);

							User.addUserRoletoUser(user, userRole).then(
								function() {
									User.Model.findById(user._id, function(findError, foundUser) {
										if (findError) {
											testFailed = 1;
											err = findError;
										}
										else {
											if (foundUser.userRoles.length != 1 && foundUser.userRoles.indexOf(userRole._id) == -1) {
												testFailed = 1;
												err = new Error('User saved to database does not have the correct UserRole.');
											}
											else {
												UserRole.userRole.findById(userRole._id, function(findError, foundUserRole) {
													if (findError) {
														testFailed = 1;
														err = findError;
													}
													else {
														if (foundUserRole.user != user._id) {
															testFailed = 1;
															err = new Error('UserRole saved to database does not have the correct User.')
														}
													}
												});
											}
										}
									});
								},
								function(addError) {
									err = addError;
									testFailed = 1;
								}
							);
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
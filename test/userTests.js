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

describe('User Model Tests', function() {
	before(function(done) {
		userModel.clear().then(done, done);
	});

	before(function(done) {
		userAccountModel.clear().then(done, done);
	});

	describe('User Model', function(){	
		
		describe('user.createUser()', function() {
		
			it('createUser creates a user object.', function() {
				var user = userModel.createUser();
				assert(typeof(user) === "object");
			});

			it('createUser creates a user object with _id field populated', function(){
				var user = userModel.createUser();
				assert(typeof(user._id) === "object" && /^[a-f\d]{24}$/i.test(user._id));
			});
		});

		describe('user.saveUser()', function() {

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
					if (testFailed) done(new Error('Save User promise resolved when it should have been rejected with Validation Error'));
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Save User did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});


			it('user.UserAccount must be a valid ID', function(done){
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
						done(new Error('Save User promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Save User did not return the correct Validation Error.\n' +
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
});
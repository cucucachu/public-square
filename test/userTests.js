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
				var rejectionErr;
				var expectedErrorMessage = 'User validation failed: userAccount: Path `userAccount` is required., lastName: Path `lastName` is required., middleName: Path `middleName` is required., firstName: Path `firstName` is required.';

				userModel.saveUser(user).then(
					function(result) {
						testFailed = 1;
					},
					function(err) {
						rejectionErr = err;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Save User promise resolved when it should have been rejected with Validation Error'));
					else {
						if (rejectionErr != null && rejectionErr.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Save User did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + rejectionErr.message
							));
						}
					}
				});
			});
		});

	});
});
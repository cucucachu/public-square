var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var Poster = require('../models/Modules/UserPost/Poster');
var UserPost = require('../models/Modules/UserPost/UserPost');


describe('UserPost Module Tests', function() {
	
	before(function(done) {
		UserPost.clear().then(
			function() {
				Poster.clear().then(done, done);
			}, 
			done
		);
	});

	describe('UserPost Model', function() {

		describe('UserPost.create()', function() {

			it('create() creates a UserPost instance.', function() {
				var userPost = UserPost.create();
				assert(typeof(userPost) === "object");
			});

			it('create() creates a UserPost instance with _id field populated', function(){
				var userPost = UserPost.create();
				assert(typeof(userPost._id) === "object" && /^[a-f\d]{24}$/i.test(userPost._id));
			});


		});


		describe('UserPost.save()', function() {

			it('UserPost.save() throws an error if required fields are missing.', function(done) {
				var userPost = UserPost.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'UserPost validation failed: poster: Path `poster` is required., textContent: Path `textContent` is required.';

				UserPost.save(userPost).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('UserPost.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'UserPost.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('UserPost.poster must be a valid ID', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: poster: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poster"';

				userPost.poster = 'abcd1234efgh9876';
				userPost.textContent = 'Here is some content';

				UserPost.save(userPost).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('UserPost.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserPost.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});			

			it('Valid Call Saves UserPost.', function(done){
				var userPost = UserPost.create();
				var error = null;
				var compareResult;

				userPost.poster = Poster.create()._id;
				userPost.textContent = 'Here is some content.';
				userPost.parentUserPost = UserPost.create()._id;
				userPost.childUserPosts = [
					UserPost.create()._id,
					UserPost.create()._id
				];

				UserPost.save(userPost).then(
					function(saved) {
						UserPost.Model.findById(userPost._id, function(findError, found) {
							compareResult = UserPost.compare(userPost, found);

							if (compareResult.match == false)
								error = new Error(compareResult.message);
						});
					},
					function(saveErr) {
						testFailed = 1;
						error = saveErr;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});
		});

	});

	describe('Poster Model', function() {

		describe('Poster.create()', function() {

			it('create() creates a Poster instance.', function() {
				var poster = Poster.create();
				assert(typeof(poster) === "object");
			});

			it('create() creates a Poster instance with _id field populated', function(){
				var poster = Poster.create();
				assert(typeof(poster._id) === "object" && /^[a-f\d]{24}$/i.test(poster._id));
			});


		});


		describe('Poster.save()', function() {

			it('Poster.save() throws an error if required fields are missing.', function(done) {
				var poster = Poster.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'Poster validation failed: user: Path `user` is required.';

				Poster.save(poster).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Poster.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Poster.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('Poster.user must be a valid ID', function(done){
				var poster = Poster.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='Poster validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

				poster.user = 'abcd1234efgh9876';

				Poster.save(poster).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						err = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Poster.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (err != null && err.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Poster.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + err.message
							));
						}
					}
				});
			});					
			
			it('Valid Call Saves Poster.', function(done){
				var poster = Poster.create();
				var error = null;
				var compareResult;

				poster.user = Poster.create()._id;

				Poster.save(poster).then(
					function(saved) {
						Poster.Model.findById(poster._id, function(findError, found) {
							compareResult = Poster.compare(poster, found);

							if (compareResult.match == false)
								error = new Error(compareResult.message);
						});
					},
					function(saveErr) {
						testFailed = 1;
						error = saveErr;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

			
		});

	});

});
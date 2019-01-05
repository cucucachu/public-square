var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/UserPost/UserPostModule');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var Poster = require('../dist/models/Modules/UserPost/Poster');
var UserPost = require('../dist/models/Modules/UserPost/UserPost');
var User = require('../dist/models/Modules/User/User');
var UserGroup = require('../dist/models/Modules/UserGroup/UserGroup');
var Stamp = require('../dist/models/Modules/UserPost/Stamp');
var Stamper = require('../dist/models/Modules/UserPost/Stamper');
var StampType = require('../dist/models/Modules/UserPost/StampType');
var ApprovalStampType = require('../dist/models/Modules/UserPost/ApprovalStampType');
var ObjectionStampType = require('../dist/models/Modules/UserPost/ObjectionStampType');
var PostStream = require('../dist/models/Modules/UserPost/PostStream');
var ExternalLink = require('../dist/models/Modules/UserPost/ExternalLink')



describe('UserPost Module Tests', function() {
	
	before(function(done) {
		UserPost.clear().then(
			function() {
				Poster.clear().then(
					function() {
						Stamp.clear().then(
							function() {
								Stamper.clear().then(
									function() {
										StampType.clear().then(
											function() {
												PostStream.clear().then(
													function() {
														ExternalLink.clear().then(done, done);
													}, 
													done
												);
											}, 
											done
										);
									},
									done								
								);
							}, 
							done
						);
					}, 
					done
				);
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
				var error = null;

				var expectedErrorMessage ='Poster validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

				poster.user = 'abcd1234efgh9876';

				Poster.save(poster).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Poster.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Poster.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
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

	describe('Stamp Model', function() {

		describe('Stamp.create()', function() {

			it('create() creates a Stamp instance.', function() {
				var stamp = Stamp.create();
				assert(typeof(stamp) === "object");
			});

			it('create() creates a Stamp instance with _id field populated', function(){
				var stamp = Stamp.create();
				assert(typeof(stamp._id) === "object" && /^[a-f\d]{24}$/i.test(stamp._id));
			});


		});


		describe('Stamp.save()', function() {

			it('Stamp.save() throws an error if required fields are missing.', function(done) {
				var stamp = Stamp.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'Stamp validation failed: stampType: Path `stampType` is required., userPost: Path `userPost` is required., stamper: Path `stamper` is required., comment: Path `comment` is required.';

				Stamp.save(stamp).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Stamp.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamp.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('Stamp.stamper must be a valid ID', function(done){
				var stamp = Stamp.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamp validation failed: stamper: Cast to ObjectID failed for value "abcd1234efgh9876" at path "stamper"';

				stamp.stamper = 'abcd1234efgh9876';
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = ApprovalStampType.create()._id;
				stamp.comment = 'I approve of this post.';

				Stamp.save(stamp).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Stamp.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamp.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});		
			

			it('Stamp.userPost must be a valid ID', function(done){
				var stamp = Stamp.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamp validation failed: userPost: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userPost"';

				stamp.stamper = Stamper.create()._id;
				stamp.userPost = 'abcd1234efgh9876';
				stamp.stampType = ApprovalStampType.create()._id;
				stamp.comment = 'I approve of this post.';

				Stamp.save(stamp).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Stamp.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamp.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('Stamp.stampType must be a valid ID', function(done){
				var stamp = Stamp.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamp validation failed: stampType: Cast to ObjectID failed for value "abcd1234efgh9876" at path "stampType"';

				stamp.stamper = Stamper.create()._id;
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = 'abcd1234efgh9876';
				stamp.comment = 'I approve of this post.';

				Stamp.save(stamp).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Stamp.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamp.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});					
			
			it('Valid Call Saves Stamp.', function(done){
				var stamp = Stamp.create();
				var error = null;
				var compareResult;

				stamp.stamper = Stamper.create()._id;
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = ApprovalStampType.create()._id;
				stamp.comment = 'I approve of this post.';


				Stamp.save(stamp).then(
					function(saved) {
						Stamp.Model.findById(stamp._id, function(findError, found) {
							compareResult = Stamp.compare(stamp, found);

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

	describe('Stamper Model', function() {

		describe('Stamper.create()', function() {

			it('create() creates a Stamper instance.', function() {
				var stamper = Stamper.create();
				assert(typeof(stamper) === "object");
			});

			it('create() creates a Stamper instance with _id field populated', function(){
				var stamper = Stamper.create();
				assert(typeof(stamper._id) === "object" && /^[a-f\d]{24}$/i.test(stamper._id));
			});


		});


		describe('Stamper.save()', function() {

			it('Stamper.save() throws an error if required fields are missing.', function(done) {
				var stamper = Stamper.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'Stamper validation failed: user: Path `user` is required.';

				Stamper.save(stamper).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Stamper.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamper.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('Stamper.stamps must be a valid ID', function(done){
				var stamper = Stamper.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamper validation failed: stamps: Cast to Array failed for value "[ \'abcd1234efgh9876\' ]" at path "stamps"';

				stamper.user = User.create()._id;
				stamper.stamps = ['abcd1234efgh9876'];

				Stamper.save(stamper).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Stamper.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamper.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	
			

			it('Stamper.user must be a valid ID', function(done){
				var stamper = Stamper.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamper validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

				stamper.user = 'abcd1234efgh9876';
				stamper.stamps = [Stamp.create()._id];

				Stamper.save(stamper).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Stamper.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Stamper.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves Stamper.', function(done){
				var stamper = Stamper.create();
				var error = null;
				var compareResult;

				stamper.user = User.create()._id;
				stamper.stamps = [Stamp.create()._id];

				Stamper.save(stamper).then(
					function(saved) {
						Stamper.Model.findById(stamper._id, function(findError, found) {
							compareResult = Stamper.compare(stamper, found);

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

	describe('ApprovalStampType Model', function() {

		describe('ApprovalStampType.create()', function() {

			it('create() creates a ApprovalStampType instance.', function() {
				var approvalStampType = ApprovalStampType.create();
				assert(typeof(approvalStampType) === "object");
			});

			it('create() creates a ApprovalStampType instance with _id field populated', function(){
				var approvalStampType = ApprovalStampType.create();
				assert(typeof(approvalStampType._id) === "object" && /^[a-f\d]{24}$/i.test(approvalStampType._id));
			});

		});


		describe('ApprovalStampType.save()', function() {

			it('ApprovalStampType.save() throws an error if required fields are missing.', function(done) {
				var approvalStampType = ApprovalStampType.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'ApprovalStampType validation failed: weight: Path `weight` is required., description: Path `description` is required., name: Path `name` is required.';

				ApprovalStampType.save(approvalStampType).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ApprovalStampType.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ApprovalStampType.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('ApprovalStampType.weight must be a number.', function(done){
				var approvalStampType = ApprovalStampType.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ApprovalStampType validation failed: weight: Cast to Number failed for value "infinity billion" at path "weight"';

				approvalStampType.name = 'Approve Mightily';
				approvalStampType.description = 'Use if you really really approve of a post.';
				approvalStampType.weight = 'infinity billion';

				ApprovalStampType.save(approvalStampType).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('ApprovalStampType.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ApprovalStampType.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves ApprovalStampType.', function(done){
				var approvalStampType = ApprovalStampType.create();
				var error = null;
				var compareResult;

				approvalStampType.name = 'Approve Mightily';
				approvalStampType.description = 'Use if you really really approve of a post.';
				approvalStampType.weight = 10;

				ApprovalStampType.save(approvalStampType).then(
					function(saved) {
						ApprovalStampType.Model.findById(approvalStampType._id, function(findError, found) {
							compareResult = ApprovalStampType.compare(approvalStampType, found);

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

	describe('ObjectionStampType Model', function() {

		describe('ObjectionStampType.create()', function() {

			it('create() creates a ObjectionStampType instance.', function() {
				var objectionStampType = ObjectionStampType.create();
				assert(typeof(objectionStampType) === "object");
			});

			it('create() creates a ObjectionStampType instance with _id field populated', function(){
				var objectionStampType = ObjectionStampType.create();
				assert(typeof(objectionStampType._id) === "object" && /^[a-f\d]{24}$/i.test(objectionStampType._id));
			});

		});


		describe('ObjectionStampType.save()', function() {

			it('ObjectionStampType.save() throws an error if required fields are missing.', function(done) {
				var objectionStampType = ObjectionStampType.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'ObjectionStampType validation failed: weight: Path `weight` is required., description: Path `description` is required., name: Path `name` is required.';

				ObjectionStampType.save(objectionStampType).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ObjectionStampType.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ObjectionStampType.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('ObjectionStampType.weight must be a number.', function(done){
				var objectionStampType = ObjectionStampType.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ObjectionStampType validation failed: weight: Cast to Number failed for value "infinity billion" at path "weight"';

				objectionStampType.name = 'Object Mightily';
				objectionStampType.description = 'Use if you really really object to a post.';
				objectionStampType.weight = 'infinity billion';

				ObjectionStampType.save(objectionStampType).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('ObjectionStampType.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ObjectionStampType.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves ObjectionStampType.', function(done){
				var objectionStampType = ObjectionStampType.create();
				var error = null;
				var compareResult;

				objectionStampType.name = 'Object Mightily';
				objectionStampType.description = 'Use if you really really object to a post.';
				objectionStampType.weight = 10;

				ObjectionStampType.save(objectionStampType).then(
					function(saved) {
						ObjectionStampType.Model.findById(objectionStampType._id, function(findError, found) {
							compareResult = ObjectionStampType.compare(objectionStampType, found);

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

	describe('PostStream Model', function() {

		describe('PostStream.create()', function() {

			it('create() creates a PostStream instance.', function() {
				var postStream = PostStream.create();
				assert(typeof(postStream) === "object");
			});

			it('create() creates a PostStream instance with _id field populated', function(){
				var postStream = PostStream.create();
				assert(typeof(postStream._id) === "object" && /^[a-f\d]{24}$/i.test(postStream._id));
			});

		});


		describe('PostStream.save()', function() {

			it('PostStream.save() throws an error if required fields are missing.', function(done) {
				var postStream = PostStream.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PostStream validation failed: userGroup: Path `userGroup` is required.';
				
				PostStream.save(postStream).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PostStream.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'PostStream.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
			

			it('PostStream.userGroup must be a valid ObjectId.', function(done) {
				var postStream = PostStream.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='PostStream validation failed: userGroup: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userGroup"';

				postStream.userGroup = 'abcd1234efgh9876';
				postStream.userPosts = [UserPost.create()._id];

				PostStream.save(postStream).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('PostStream.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'PostStream.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});		
			

			it('PostStream.userPosts must be a valid Array of ObjectIds.', function(done) {
				var postStream = PostStream.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='PostStream validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\' ]" at path "userPosts"';

				postStream.userGroup = UserGroup.create()._id;
				postStream.userPosts = ['abcd1234efgh9876'];

				PostStream.save(postStream).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('PostStream.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'PostStream.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves PostStream.', function(done){
				var postStream = PostStream.create();
				var error = null;
				var compareResult;

				postStream.userGroup = UserGroup.create()._id;
				postStream.userPosts = [UserPost.create()._id];

				PostStream.save(postStream).then(
					function(saved) {
						PostStream.Model.findById(postStream._id, function(findError, found) {
							compareResult = PostStream.compare(postStream, found);

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

	describe('ExternalLink Model', function() {

		describe('ExternalLink.create()', function() {

			it('create() creates a ExternalLink instance.', function() {
				var externalLink = ExternalLink.create();
				assert(typeof(externalLink) === "object");
			});

			it('create() creates a ExternalLink instance with _id field populated', function() {
				var externalLink = ExternalLink.create();
				assert(typeof(externalLink._id) === "object" && /^[a-f\d]{24}$/i.test(externalLink._id));
			});

		});


		describe('ExternalLink.save()', function() {

			it('ExternalLink.save() throws an error if required fields are missing.', function(done) {
				var externalLink = ExternalLink.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'ExternalLink validation failed: url: Path `url` is required.';
				
				ExternalLink.save(externalLink).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExternalLink.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ExternalLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('ExternalLink.userPosts must be a valid Array of ObjectIds.', function(done) {
				var externalLink = ExternalLink.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ExternalLink validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\' ]" at path "userPosts"';

				externalLink.url = 'http://www.google.com';
				externalLink.userPosts = ['abcd1234efgh9876'];

				ExternalLink.save(externalLink).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error(''));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ExternalLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves ExternalLink.', function(done) {
				var externalLink = ExternalLink.create();
				var error = null;
				var compareResult;

				externalLink.url = 'http://www.google.com';
				externalLink.userPosts = [UserPost.create()._id];

				ExternalLink.save(externalLink).then(
					function(saved) {
						ExternalLink.Model.findById(externalLink._id, function(findError, found) {
							compareResult = ExternalLink.compare(externalLink, found);

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

	describe('UserPost Module Interactions', function() {

		describe('UserPost.saveUserPostAndPoster()', function() {
		
			it('UserPost.saveUserPostAndPoster() throws an error when UserPost.poster is set to a different Poster.', function(done) {
				var error = null;
				var testFailed = 0;
				var expectedErrorMessage = 'UserPost.saveUserPostAndPoster(userPost, Poster), Error: Illegal attempt to update UserPost to a new Poster.';

				var userPost = UserPost.create();
				var poster = Poster.create();

				userPost.textContent = 'Here is some content.';
				poster.user = User.create()._id;
				userPost.poster = Poster.create()._id;

				UserPost.saveUserPostAndPoster(userPost, poster).then(
					function() {
						testFailed = 1;
					},
					function(saveError) {
						error = saveError;
					}
				).finally(function() {
					if (testFailed) {
						done(new Error('UserPost.saveUserPostAndPoster() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserPost.saveUserPostAndPoster() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
		
			it('UserPost.saveUserPostAndPoster() throws an error userPost and poster are invalid.', function(done) {
				var error = null;
				var testFailed = 0;
				var expectedErrorMessage = 'UserPost validation failed: textContent: Path `textContent` is required.Poster validation failed: user: Path `user` is required.';

				var userPost = UserPost.create();
				var poster = Poster.create();

				UserPost.saveUserPostAndPoster(userPost, poster).then(
					function() {
						testFailed = 1;
					},
					function(saveError) {
						error = saveError;
					}
				).finally(function() {
					if (testFailed) {
						done(new Error('UserPost.saveUserPostAndPoster() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserPost.saveUserPostAndPoster() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
		
			it('UserPost.saveUserPostAndPoster() saves UserPost and Poster Correctly', function(done) {
				var error = null;

				var userPost = UserPost.create();
				var poster = Poster.create();

				userPost.textContent = 'Here is some content.';
				poster.user = User.create()._id;

				UserPost.saveUserPostAndPoster(userPost, poster).then(
					function() {

						UserPost.Model.findById(userPost._id, function(findError, found) {
							if (findError) 
								error = findError;
							else if (found.poster != poster._id) {
								error = new Error('UserPost.saveUserPostAndPoster() promise returned, but saved UserPost.poster to the wrong poster.');
							}
							else {
								Poster.Model.findById(poster._id, function(findError, found) {
									console.log(
										'poster: ' + found._id + '\n' +
										'poster.userPosts: ' + found.userPosts + '\n' | 
										'userPost: ' + userPost._id
									);

									if (findError)
										error = findError;
									else if (! (userPost._id in found.userPosts)) {
										error = new Error('UserPost.saveUserPostAndPoster() promise returned, but saved poster.userPosts to the wrong UserPost.');
									}
								});
							}
						});
					},
					function(saveError) {
						error = saveError;
					}
				).finally(function() {
					if (error != null) {
						done(error);
					}
					else {
						done();
					}
				});
			});

		});

	});

});
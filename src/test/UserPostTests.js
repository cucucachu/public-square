var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/UserPost/UserPostModule');

// Add 'finally()' to 'Promise.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var Poster = require('../dist/models/Modules/UserPost/Poster');
var UserPost = require('../dist/models/Modules/UserPost/UserPost');
var UserAccount = require('../dist/models/Modules/User/UserAccount');
var UserGroup = require('../dist/models/Modules/UserGroup/UserGroup');
var Stamp = require('../dist/models/Modules/UserPost/Stamp');
var Stamper = require('../dist/models/Modules/UserPost/Stamper');
var StampType = require('../dist/models/Modules/UserPost/StampType');
var ApprovalStampType = require('../dist/models/Modules/UserPost/ApprovalStampType');
var ObjectionStampType = require('../dist/models/Modules/UserPost/ObjectionStampType');
var PostStream = require('../dist/models/Modules/UserPost/PostStream');
var ExternalLink = require('../dist/models/Modules/UserPost/ExternalLink');
var ArticleLink = require('../dist/models/Modules/UserPost/ArticleLink');
var ImageLink = require('../dist/models/Modules/UserPost/ImageLink');
var VideoLink = require('../dist/models/Modules/UserPost/VideoLink');



describe('UserPost Module Tests', function() {
	
	before((done) => {
		UserPost.clear().then(() => {
			Poster.clear().then(() => {
				Stamp.clear().then(() => {
					Stamper.clear().then(() => {
						StampType.clear().then(() => {
							PostStream.clear().then(() => {
								ExternalLink.clear().then(done, done);
							});
						});
					});
				});
			});
		});
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
				var expectedErrorMessage = 'UserPost validation failed: postStream: Path `postStream` is required., poster: Path `poster` is required., postDate: Path `postDate` is required., textContent: Path `textContent` is required.';

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

				var expectedErrorMessage = 'UserPost validation failed: poster: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poster"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = 'abcd1234efgh9876';
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

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

			it('UserPost.parentUserPost must be a valid ID', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: parentUserPost: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentUserPost"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = 'abcd1234efgh9876';
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

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

			it('UserPost.postStream must be a valid ID', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: postStream: Cast to ObjectID failed for value "abcd1234efgh9876" at path "postStream"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = 'abcd1234efgh9876';
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

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

			it('UserPost.childUserPosts must be a valid Array of IDs', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: childUserPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "childUserPosts"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = ['abcd1234efgh9876', 'abcd1234efgh9875']
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

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

			it('UserPost.externalLinks must be a valid Array of IDs', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: externalLinks: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "externalLinks"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = ['abcd1234efgh9876', 'abcd1234efgh9875']
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

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

			it('UserPost.stamps must be a valid Array of IDs', function(done){
				var userPost = UserPost.create();
				var testFailed = 0;
				var err = null;

				var expectedErrorMessage ='UserPost validation failed: stamps: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "stamps"';

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = ['abcd1234efgh9876', 'abcd1234efgh9875'];

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

				userPost.textContent = 'Here is some content.';
				userPost.postDate = new Date();
				userPost.poster = Poster.create()._id;
				userPost.parentUserPost = UserPost.create()._id;
				userPost.postStream = PostStream.create()._id;
				userPost.childUserPosts = [UserPost.create()._id, UserPost.create()._id];
				userPost.externalLinks = [VideoLink.create()._id, ExternalLink.create()._id];
				userPost.stamps = [Stamp.create()._id, Stamp.create()._id];

				UserPost.save(userPost).then(
					(saved) => {
						UserPost.findById(userPost._id).then(
							(found) => {
								compareResult = UserPost.compare(userPost, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'Poster validation failed: userPosts: Path `userPosts` is required. Poster validation failed: userAccount: Path `userAccount` is required.';

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
			

			it('Poster.userAccount must be a valid ID', function(done){
				var poster = Poster.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Poster validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';

				poster.startDate = new Date();
				poster.userAccount = 'abcd1234efgh9876';
				poster.userPosts = [UserPost.create()._id, UserPost.create()._id];

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
			

			it('Poster.userPosts must be a valid Array of IDs', function(done){
				var poster = Poster.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Poster validation failed: userPosts: Path `userPosts` is required. Poster validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userPosts"';

				poster.startDate = new Date();
				poster.userAccount = UserAccount.create()._id;
				poster.userPosts = ['abcd1234efgh9876', 'abcd1234efgh9875'];

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

				poster.startDate = new Date();
				poster.userAccount = UserAccount.create()._id;
				poster.userPosts = [UserPost.create()._id, UserPost.create()._id];

				Poster.save(poster).then(
					(saved) => {
						Poster.findById(poster._id).then(
							(found) => {
								compareResult = Poster.compare(poster, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'Stamp validation failed: stampType: Path `stampType` is required., userPost: Path `userPost` is required., stamper: Path `stamper` is required., stampDate: Path `stampDate` is required.';

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

				stamp.comment = 'I approve of this post.';
				stamp.stampDate = new Date();
				stamp.stamper = 'abcd1234efgh9876';
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = ApprovalStampType.create()._id;

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

				stamp.comment = 'I approve of this post.';
				stamp.stampDate = new Date();
				stamp.stamper = Stamper.create()._id;
				stamp.userPost = 'abcd1234efgh9876';
				stamp.stampType = ApprovalStampType.create()._id;

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

				stamp.comment = 'I approve of this post.';
				stamp.stampDate = new Date();
				stamp.stamper = Stamper.create()._id;
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = 'abcd1234efgh9876';

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

				stamp.comment = 'I approve of this post.';
				stamp.stampDate = new Date();
				stamp.stamper = Stamper.create()._id;
				stamp.userPost = UserPost.create()._id;
				stamp.stampType = ApprovalStampType.create()._id;

				Stamp.save(stamp).then(
					(saved) => {
						Stamp.findById(stamp._id).then(
							(found) => {
								compareResult = Stamp.compare(stamp, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'Stamper validation failed: stamps: Path `stamps` is required. Stamper validation failed: userAccount: Path `userAccount` is required.';

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
			

			it('Stamper.stamps must be a valid Array of IDs', function(done){
				var stamper = Stamper.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamper validation failed: stamps: Path `stamps` is required. Stamper validation failed: stamps: Cast to Array failed for value "[ \'abcd1234efgh9876\' ]" at path "stamps"';

				stamper.startDate = new Date();
				stamper.userAccount = UserAccount.create()._id;
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
			

			it('Stamper.userAccount must be a valid ID', function(done){
				var stamper = Stamper.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Stamper validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';

				stamper.startDate = new Date();
				stamper.userAccount = 'abcd1234efgh9876';
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

				stamper.userAccount = UserAccount.create()._id;
				stamper.startDate = new Date();
				stamper.stamps = [Stamp.create()._id];

				Stamper.save(stamper).then(
					(saved) => {
						Stamper.findById(stamper._id).then(
							(found) => {
								compareResult = Stamper.compare(stamper, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
					(saved) => {
						ApprovalStampType.findById(approvalStampType._id).then(
							(found) => {
								compareResult = ApprovalStampType.compare(approvalStampType, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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

				objectionStampType.name = 'Approve Mightily';
				objectionStampType.description = 'Use if you really really approve of a post.';
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

				objectionStampType.name = 'Approve Mightily';
				objectionStampType.description = 'Use if you really really approve of a post.';
				objectionStampType.weight = 10;

				ObjectionStampType.save(objectionStampType).then(
					(saved) => {
						ObjectionStampType.findById(objectionStampType._id).then(
							(found) => {
								compareResult = ObjectionStampType.compare(objectionStampType, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'PostStream validation failed: userPosts: Path `userPosts` is required. PostStream validation failed: userGroup: Path `userGroup` is required.';
				
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

				var expectedErrorMessage ='PostStream validation failed: userPosts: Path `userPosts` is required. PostStream validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\' ]" at path "userPosts"';

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
					(saved) => {
						PostStream.findById(postStream._id).then(
							(found) => {
								compareResult = PostStream.compare(postStream, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'ExternalLink validation failed: text: Path `text` is required., url: Path `url` is required., createdAt: Path `createdAt` is required.';
				
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

			it('ExternalLink.userPosts must be a valid Array of IDs.', function(done) {
				var externalLink = ExternalLink.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ExternalLink validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userPosts"';

				externalLink.url = 'http://www.google.com';
				externalLink.text = 'Google';
				externalLink.createdAt = new Date();
				externalLink.userPosts = ['abcd1234efgh9876', 'abcd1234efgh9875'];


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
				externalLink.text = 'Google';
				externalLink.createdAt = new Date();
				externalLink.userPosts = [UserPost.create()._id];

				ExternalLink.save(externalLink).then(
					(saved) => {
						ExternalLink.findById(externalLink._id).then(
							(found) => {
								compareResult = ExternalLink.compare(externalLink, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('ArticleLink Model', function() {

		describe('ArticleLink.create()', function() {

			it('create() creates a ArticleLink instance.', function() {
				var articleLink = ArticleLink.create();
				assert(typeof(articleLink) === "object");
			});

			it('create() creates a ArticleLink instance with _id field populated', function() {
				var articleLink = ArticleLink.create();
				assert(typeof(articleLink._id) === "object" && /^[a-f\d]{24}$/i.test(articleLink._id));
			});

		});


		describe('ArticleLink.save()', function() {

			it('ArticleLink.save() throws an error if required fields are missing.', function(done) {
				var articleLink = ArticleLink.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'ArticleLink validation failed: text: Path `text` is required., url: Path `url` is required., createdAt: Path `createdAt` is required.';
				
				ArticleLink.save(articleLink).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ArticleLink.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ArticleLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('ArticleLink.userPosts must be a valid Array of IDs.', function(done) {
				var articleLink = ArticleLink.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ArticleLink validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userPosts"';

				articleLink.url = 'http://www.google.com';
				articleLink.text = 'Google';
				articleLink.createdAt = new Date();
				articleLink.userPosts = ['abcd1234efgh9876', 'abcd1234efgh9875'];


				ArticleLink.save(articleLink).then(
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
								'ArticleLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves ArticleLink.', function(done) {
				var articleLink = ArticleLink.create();
				var error = null;
				var compareResult;

				articleLink.url = 'http://www.google.com';
				articleLink.text = 'Google';
				articleLink.createdAt = new Date();
				articleLink.userPosts = [UserPost.create()._id];

				ArticleLink.save(articleLink).then(
					(saved) => {
						ArticleLink.findById(articleLink._id).then(
							(found) => {
								compareResult = ArticleLink.compare(articleLink, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('ImageLink Model', function() {

		describe('ImageLink.create()', function() {

			it('create() creates a ImageLink instance.', function() {
				var imageLink = ImageLink.create();
				assert(typeof(imageLink) === "object");
			});

			it('create() creates a ImageLink instance with _id field populated', function() {
				var imageLink = ImageLink.create();
				assert(typeof(imageLink._id) === "object" && /^[a-f\d]{24}$/i.test(imageLink._id));
			});

		});


		describe('ImageLink.save()', function() {

			it('ImageLink.save() throws an error if required fields are missing.', function(done) {
				var imageLink = ImageLink.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'ImageLink validation failed: text: Path `text` is required., url: Path `url` is required., createdAt: Path `createdAt` is required.';
				
				ImageLink.save(imageLink).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ImageLink.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'ImageLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('ImageLink.userPosts must be a valid Array of IDs.', function(done) {
				var imageLink = ImageLink.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='ImageLink validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userPosts"';

				imageLink.url = 'http://www.google.com';
				imageLink.text = 'Google';
				imageLink.createdAt = new Date();
				imageLink.userPosts = ['abcd1234efgh9876', 'abcd1234efgh9875'];


				ImageLink.save(imageLink).then(
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
								'ImageLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves ImageLink.', function(done) {
				var imageLink = ImageLink.create();
				var error = null;
				var compareResult;

				imageLink.url = 'http://www.google.com';
				imageLink.text = 'Google';
				imageLink.createdAt = new Date();
				imageLink.userPosts = [UserPost.create()._id];

				ImageLink.save(imageLink).then(
					(saved) => {
						ImageLink.findById(imageLink._id).then(
							(found) => {
								compareResult = ImageLink.compare(imageLink, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('VideoLink Model', function() {

		describe('VideoLink.create()', function() {

			it('create() creates a VideoLink instance.', function() {
				var videoLink = VideoLink.create();
				assert(typeof(videoLink) === "object");
			});

			it('create() creates a VideoLink instance with _id field populated', function() {
				var videoLink = VideoLink.create();
				assert(typeof(videoLink._id) === "object" && /^[a-f\d]{24}$/i.test(videoLink._id));
			});

		});


		describe('VideoLink.save()', function() {

			it('VideoLink.save() throws an error if required fields are missing.', function(done) {
				var videoLink = VideoLink.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'VideoLink validation failed: text: Path `text` is required., url: Path `url` is required., createdAt: Path `createdAt` is required.';
				
				VideoLink.save(videoLink).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('VideoLink.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'VideoLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('VideoLink.userPosts must be a valid Array of IDs.', function(done) {
				var videoLink = VideoLink.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='VideoLink validation failed: userPosts: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userPosts"';

				videoLink.url = 'http://www.google.com';
				videoLink.text = 'Google';
				videoLink.createdAt = new Date();
				videoLink.userPosts = ['abcd1234efgh9876', 'abcd1234efgh9875'];


				VideoLink.save(videoLink).then(
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
								'VideoLink.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				
			
			it('Valid Call Saves VideoLink.', function(done) {
				var videoLink = VideoLink.create();
				var error = null;
				var compareResult;

				videoLink.url = 'http://www.google.com';
				videoLink.text = 'Google';
				videoLink.createdAt = new Date();
				videoLink.userPosts = [UserPost.create()._id];

				VideoLink.save(videoLink).then(
					(saved) => {
						VideoLink.findById(videoLink._id).then(
							(found) => {
								compareResult = VideoLink.compare(videoLink, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

});
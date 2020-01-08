/*
	Unit Tests for the Models in the UserPost Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Modules/UserPost/UserPostModule');
const StampType = require('../../src/models/Modules/UserPost/StampType');
const ExternalLink = require('../../src/models/Modules/UserPost/ExternalLink');
const PostStream = require('../../src/models/Modules/UserPost/PostStream');
const UserPost = require('../../src/models/Modules/UserPost/UserPost');
const Poster = require('../../src/models/Modules/UserPost/Poster');
const Stamp = require('../../src/models/Modules/UserPost/Stamp');
const Stamper = require('../../src/models/Modules/UserPost/Stamper');
const ObjectionStampType = require('../../src/models/Modules/UserPost/ObjectionStampType');
const ApprovalStampType = require('../../src/models/Modules/UserPost/ApprovalStampType');
const ArticleLink = require('../../src/models/Modules/UserPost/ArticleLink');
const ImageLink = require('../../src/models/Modules/UserPost/ImageLink');
const VideoLink = require('../../src/models/Modules/UserPost/VideoLink');

describe('UserPost Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - StampType', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance for abstract class.', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				testForError('new Instance(StampType)', expectedErrorMessage, () => {
					new Instance(StampType);
				});

			});
		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - ExternalLink', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "createdAt", "url", "text"';
				const externalLink = new Instance(ExternalLink);

				await testForErrorAsync('externalLink.validate()', externalLink.id + expectedErrorMessage, async() => {
					return externalLink.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - PostStream', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "userGroup", "userPosts"';
				const postStream = new Instance(PostStream);

				await testForErrorAsync('postStream.validate()', postStream.id + expectedErrorMessage, async() => {
					return postStream.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - UserPost', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "textContent", "postDate", "poster", "postStream"';
				const userPost = new Instance(UserPost);

				await testForErrorAsync('userPost.validate()', userPost.id + expectedErrorMessage, async() => {
					return userPost.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - Poster', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "userPosts", "userAccount"';
				const poster = new Instance(Poster);

				await testForErrorAsync('poster.validate()', poster.id + expectedErrorMessage, async() => {
					return poster.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - Stamp', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "stampDate", "stamper", "userPost", "stampType"';
				const stamp = new Instance(Stamp);

				await testForErrorAsync('stamp.validate()', stamp.id + expectedErrorMessage, async() => {
					return stamp.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - Stamper', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "userAccount"';
				const stamper = new Instance(Stamper);

				await testForErrorAsync('stamper.validate()', stamper.id + expectedErrorMessage, async() => {
					return stamper.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - ApprovalStampType', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "description", "weight"';
				const approvalStampType = new Instance(ApprovalStampType);

				await testForErrorAsync('approvalStampType.validate()', approvalStampType.id + expectedErrorMessage, async() => {
					return approvalStampType.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - ObjectionStampType', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "description", "weight"';
				const objectionStampType = new Instance(ObjectionStampType);

				await testForErrorAsync('objectionStampType.validate()', objectionStampType.id + expectedErrorMessage, async() => {
					return objectionStampType.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - ArticleLink', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "createdAt", "url", "text"';
				const articleLink = new Instance(ArticleLink);

				await testForErrorAsync('articleLink.validate()', articleLink.id + expectedErrorMessage, async() => {
					return articleLink.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - ImageLink', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "createdAt", "url", "text"';
				const imageLink = new Instance(ImageLink);

				await testForErrorAsync('imageLink.validate()', imageLink.id + expectedErrorMessage, async() => {
					return imageLink.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

	describe('ClassModel - VideoLink', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "createdAt", "url", "text"';
				const videoLink = new Instance(VideoLink);

				await testForErrorAsync('videoLink.validate()', videoLink.id + expectedErrorMessage, async() => {
					return videoLink.validate();
				});

			});

		});

		describe('CRUD Functions', () => {

		});

		describe('Static Methods', () => {

		});

		describe('Non-Static Methods', () => {

		});

	});

});
/*
	Unit Tests for Class Model ArticleLink
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/UserPost/index');
const StampType = require('../../../src/models/UserPost/StampType');
const ExternalLink = require('../../../src/models/UserPost/ExternalLink');
const PostStream = require('../../../src/models/UserPost/PostStream');
const UserPost = require('../../../src/models/UserPost/UserPost');
const Poster = require('../../../src/models/UserPost/Poster');
const Stamp = require('../../../src/models/UserPost/Stamp');
const Stamper = require('../../../src/models/UserPost/Stamper');
const ObjectionStampType = require('../../../src/models/UserPost/ObjectionStampType');
const ApprovalStampType = require('../../../src/models/UserPost/ApprovalStampType');
const ArticleLink = require('../../../src/models/UserPost/ArticleLink');
const ImageLink = require('../../../src/models/UserPost/ImageLink');
const VideoLink = require('../../../src/models/UserPost/VideoLink');

describe('ClassModel - ArticleLink', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
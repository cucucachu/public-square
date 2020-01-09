/*
	Unit Tests for Class Model AuthToken
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/User/index')
const UserRole = require('../../../src/models/User/UserRole');
const PersonRole = require('../../../src/models/User/PersonRole');
const Person = require('../../../src/models/User/Person');
const UserAccount = require('../../../src/models/User/UserAccount');
const AuthToken = require('../../../src/models/User/AuthToken');

describe('ClassModel - AuthToken', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "createdAt", "expiresAt", "userAccount"';
            const authToken = new Instance(AuthToken);

            await testForErrorAsync('authToken.validate()', authToken.id + expectedErrorMessage, async() => {
                return authToken.validate();
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
/*
	Unit Tests for Class Model PersonRole
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/User/UserModule')
const UserRole = require('../../../src/models/User/UserRole');
const PersonRole = require('../../../src/models/User/PersonRole');
const Person = require('../../../src/models/User/Person');
const UserAccount = require('../../../src/models/User/UserAccount');
const AuthToken = require('../../../src/models/User/AuthToken');

describe('ClassModel - PersonRole', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown when calling new Instance for abstract class.', async() => {
            const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

            testForError('new Instance(PersonRole)', expectedErrorMessage, () => {
                new Instance(PersonRole);
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
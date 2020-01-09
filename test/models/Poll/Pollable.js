/*
	Unit Tests for Class Model Pollable
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Poll/index');
const Poll = require('../../../src/models/Poll/Poll');
const PollResponse = require('../../../src/models/Poll/PollResponse');
const PollOption = require('../../../src/models/Poll/PollOption');
const Pollable = require('../../../src/models/Poll/Pollable');
const Citizen = require('../../../src/models/Poll/Citizen');
const Civilian = require('../../../src/models/Poll/Civilian');

describe('ClassModel - Pollable', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown when calling new Instance for abstract class.', async() => {
            const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

            testForError('new Instance(Pollable)', expectedErrorMessage, () => {
                new Instance(Pollable);
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
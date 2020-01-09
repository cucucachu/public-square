/*
	Unit Tests for Class Model Civilian
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

describe('ClassModel - Civilian', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "userAccount"';
            const civilian = new Instance(Civilian);

            await testForErrorAsync('civilian.validate()', civilian.id + expectedErrorMessage, async() => {
                return civilian.validate();
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
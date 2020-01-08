/*
	Unit Tests for the Models in the Poll Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Poll/PollModule');
const Poll = require('../../src/models/Poll/Poll');
const PollResponse = require('../../src/models/Poll/PollResponse');
const PollOption = require('../../src/models/Poll/PollOption');
const Pollable = require('../../src/models/Poll/Pollable');
const Citizen = require('../../src/models/Poll/Citizen');
const Civilian = require('../../src/models/Poll/Civilian');

describe('Poll Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Poll', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "pollable"';
				const poll = new Instance(Poll);

				await testForErrorAsync('poll.validate()', poll.id + expectedErrorMessage, async() => {
					return poll.validate();
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

	describe('ClassModel - PollResponse', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "date", "civilian", "poll", "pollOption"';
				const pollResponse = new Instance(PollResponse);

				await testForErrorAsync('pollResponse.validate()', pollResponse.id + expectedErrorMessage, async() => {
					return pollResponse.validate();
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

	describe('ClassModel - PollOption', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const pollOption = new Instance(PollOption);

				await testForErrorAsync('pollOption.validate()', pollOption.id + expectedErrorMessage, async() => {
					return pollOption.validate();
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

	describe('ClassModel - Pollable', () => {

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

	describe('ClassModel - Citizen', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "userAccount"';
				const citizen = new Instance(Citizen);

				await testForErrorAsync('citizen.validate()', citizen.id + expectedErrorMessage, async() => {
					return citizen.validate();
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

	describe('ClassModel - Civilian', () => {

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

});
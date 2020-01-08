/*
	Unit Tests for the Models in the Nomination Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Modules/Government/Nomination/NominationModule');
const Nomination = require('../../src/models/Modules/Government/Nomination/Nomination');
const Nominator = require('../../src/models/Modules/Government/Nomination/Nominator');
const Nominee = require('../../src/models/Modules/Government/Nomination/Nominee');
const ConfirmationVote = require('../../src/models/Modules/Government/Nomination/ConfirmationVote');
const ConfirmationVoteOption = require('../../src/models/Modules/Government/Nomination/ConfirmationVoteOption');
const IndividualConfirmationVote = require('../../src/models/Modules/Government/Nomination/IndividualConfirmationVote');
const Confirmer = require('../../src/models/Modules/Government/Nomination/Confirmer');
const GovernmentPosition = require('../../src/models/Modules/Government/GovernmentPosition');


describe('Nomination Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Nomination', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "nominator", "nominee", "governmentPosition"';
				const nomination = new Instance(Nomination);

				await testForErrorAsync('nomination.validate()', nomination.id + expectedErrorMessage, async() => {
					return nomination.validate();
				});

			});

			describe('Validation - Position Start Date After Nomination Date', () => {

				it('Error thrown if positionStartDate is before nominationDate.', async() => {
					const expectedErrorMessage = ': Position Start Date must be greater than or equal to Nomination Date.';
					const nomination = new Instance(Nomination);

					nomination.assign({
						nominationDate: new Date('2000-01-01'),
						positionStartDate: new Date('1999-12-31'),
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});
	
					await testForErrorAsync('nomination.validate()', nomination.id + expectedErrorMessage, async() => {
						return nomination.validate();
					});

				});

				it('No Error thrown if positionStartDate is equal to nominationDate.', async() => {
					const nomination = new Instance(Nomination);

					nomination.assign({
						nominationDate: new Date('2000-01-01'),
						positionStartDate: new Date('2000-01-01'),
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});

					await nomination.validate();
				});

				it('No Error thrown if positionStartDate is after nominationDate.', async() => {
					const nomination = new Instance(Nomination);

					nomination.assign({
						nominationDate: new Date('2000-01-01'),
						positionStartDate: new Date('2000-01-02'),
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});

					await nomination.validate();
				});

				it('No Error thrown if positionStartDate is ommitted.', async() => {
					const nomination = new Instance(Nomination);

					nomination.assign({
						nominationDate: new Date('2000-01-01'),
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});

					await nomination.validate();
				});

				it('No Error thrown if nominationDate is ommitted.', async() => {
					const nomination = new Instance(Nomination);

					nomination.assign({
						positionStartDate: new Date('1999-12-31'),
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});

					await nomination.validate();
				});

				it('No Error thrown if both positionStartDate and nominationDate are ommitted.', async() => {
					const nomination = new Instance(Nomination);

					nomination.assign({
						nominator: new Instance(Nominator),
						nominee: new Instance(Nominee),
						governmentPosition: new Instance(GovernmentPosition),
					});

					await nomination.validate();
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

	describe('ClassModel - Nominator', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
				const nominator = new Instance(Nominator);

				await testForErrorAsync('nominator.validate()', nominator.id + expectedErrorMessage, async() => {
					return nominator.validate();
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

	describe('ClassModel - Nominee', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "nominations", "person"';
				const nominee = new Instance(Nominee);

				await testForErrorAsync('nominee.validate()', nominee.id + expectedErrorMessage, async() => {
					return nominee.validate();
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

	describe('ClassModel - ConfirmationVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "date", "nomination"';
				const confirmationVote = new Instance(ConfirmationVote);

				await testForErrorAsync('confirmationVote.validate()', confirmationVote.id + expectedErrorMessage, async() => {
					return confirmationVote.validate();
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

	describe('ClassModel - ConfirmationVoteOption', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const confirmationVoteOption = new Instance(ConfirmationVoteOption);

				await testForErrorAsync('confirmationVoteOption.validate()', confirmationVoteOption.id + expectedErrorMessage, async() => {
					return confirmationVoteOption.validate();
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

	describe('ClassModel - IndividualConfirmationVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "confirmer", "confirmationVote", "confirmationVoteOption"';
				const individualConfirmationVote = new Instance(IndividualConfirmationVote);

				await testForErrorAsync('individualConfirmationVote.validate()', individualConfirmationVote.id + expectedErrorMessage, async() => {
					return individualConfirmationVote.validate();
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

	describe('ClassModel - Confirmer', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
				const confirmer = new Instance(Confirmer);

				await testForErrorAsync('confirmer.validate()', confirmer.id + expectedErrorMessage, async() => {
					return confirmer.validate();
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
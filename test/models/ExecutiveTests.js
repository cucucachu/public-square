/*
	Unit Tests for the Models in the Executive Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Government/Executive/ExecutiveModule');
const ExecutiveAction = require('../../src/models/Government/Executive/ExecutiveAction');
const Executive = require('../../src/models/Government/Executive/Executive');
const IndividualExecutiveAction = require('../../src/models/Government/Executive/IndividualExecutiveAction');
const GroupExecutiveAction = require('../../src/models/Government/Executive/GroupExecutiveAction');
const IndividualExecutiveVote = require('../../src/models/Government/Executive/IndividualExecutiveVote');
const ExecutiveVoteOption = require('../../src/models/Government/Executive/ExecutiveVoteOption');
const ExecutiveVote = require('../../src/models/Government/Executive/ExecutiveVote');
const Poll = require('../../src/models/Poll/Poll');

describe('Executive Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - ExecutiveAction', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance(ExecutiveAction).', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				await testForErrorAsync('executiveAction.validate()', expectedErrorMessage, async() => {
					return new Instance(ExecutiveAction);
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

	describe('ClassModel - IndividualExecutiveAction', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "text", "poll"';
				const individualExecutiveAction = new Instance(IndividualExecutiveAction);

				await testForErrorAsync('individualExecutiveAction.validate()', individualExecutiveAction.id + expectedErrorMessage, async() => {
					return individualExecutiveAction.validate();
				});

			});

			describe('Validation - Effective Date After Passed Date', () => {

				it('Error thrown if effectiveDate is before passedDate.', async() => {
					const expectedErrorMessage = ': Effective Date must be greater than or equal to Passed Date.';
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('1999-12-31'),
						poll,
					});
	
					await testForErrorAsync('individualExecutiveAction.validate()', individualExecutiveAction.id + expectedErrorMessage, async() => {
						return individualExecutiveAction.validate();
					});

				});

				it('No Error thrown if effectiveDate is equal to passedDate.', async() => {
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('2000-01-01'),
						poll,
					});
	
					await individualExecutiveAction.validate();
				});

				it('No Error thrown if effectiveDate is after passedDate.', async() => {
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('2000-01-02'),
						poll,
					});
	
					await individualExecutiveAction.validate();
				});

				it('No Error thrown if effectiveDate is not given.', async() => {
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						poll,
					});
	
					await individualExecutiveAction.validate();
				});

				it('No Error thrown if passedDate is not given.', async() => {
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						effectiveDate: new Date('2000-01-02'),
						poll,
					});
	
					await individualExecutiveAction.validate();
				});

				it('No Error thrown if passedDate and effective date are not given.', async() => {
					const individualExecutiveAction = new Instance(IndividualExecutiveAction);
					const poll = new Instance(Poll);

					individualExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						poll,
					});
	
					await individualExecutiveAction.validate();
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

	describe('ClassModel - GroupExecutiveAction', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "text", "poll"';
				const groupExecutiveAction = new Instance(GroupExecutiveAction);

				await testForErrorAsync('groupExecutiveAction.validate()', groupExecutiveAction.id + expectedErrorMessage, async() => {
					return groupExecutiveAction.validate();
				});

			});

			describe('Validation - Effective Date After Passed Date', () => {

				it('Error thrown if effectiveDate is before passedDate.', async() => {
					const expectedErrorMessage = ': Effective Date must be greater than or equal to Passed Date.';
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('1999-12-31'),
						poll,
					});
	
					await testForErrorAsync('groupExecutiveAction.validate()', groupExecutiveAction.id + expectedErrorMessage, async() => {
						return groupExecutiveAction.validate();
					});

				});

				it('No Error thrown if effectiveDate is equal to passedDate.', async() => {
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('2000-01-01'),
						poll,
					});
	
					await groupExecutiveAction.validate();
				});

				it('No Error thrown if effectiveDate is after passedDate.', async() => {
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						effectiveDate: new Date('2000-01-02'),
						poll,
					});
	
					await groupExecutiveAction.validate();
				});

				it('No Error thrown if effectiveDate is not given.', async() => {
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						passedDate: new Date('2000-01-01'),
						poll,
					});
	
					await groupExecutiveAction.validate();
				});

				it('No Error thrown if passedDate is not given.', async() => {
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						effectiveDate: new Date('2000-01-02'),
						poll,
					});
	
					await groupExecutiveAction.validate();
				});

				it('No Error thrown if passedDate and effective date are not given.', async() => {
					const groupExecutiveAction = new Instance(GroupExecutiveAction);
					const poll = new Instance(Poll);

					groupExecutiveAction.assign({
						name: 'Public Square Act',
						text: 'Make Public Square the Best.',
						poll,
					});
	
					await groupExecutiveAction.validate();
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

	describe('ClassModel - Executive', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
				const executive = new Instance(Executive);

				await testForErrorAsync('executive.validate()', executive.id + expectedErrorMessage, async() => {
					return executive.validate();
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

	describe('ClassModel - ExecutiveVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "date", "groupExecutiveAction"';
				const executiveVote = new Instance(ExecutiveVote);

				await testForErrorAsync('executiveVote.validate()', executiveVote.id + expectedErrorMessage, async() => {
					return executiveVote.validate();
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

	describe('ClassModel - IndividualExecutiveVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "executive", "executiveVote", "executiveVoteOption"';
				const individualExecutiveVote = new Instance(IndividualExecutiveVote);

				await testForErrorAsync('individualExecutiveVote.validate()', individualExecutiveVote.id + expectedErrorMessage, async() => {
					return individualExecutiveVote.validate();
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

	describe('ClassModel - ExecutiveVoteOption', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const executiveVoteOption = new Instance(ExecutiveVoteOption);

				await testForErrorAsync('executiveVoteOption.validate()', executiveVoteOption.id + expectedErrorMessage, async() => {
					return executiveVoteOption.validate();
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
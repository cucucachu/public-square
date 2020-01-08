/*
	Unit Tests for the Models in the Election Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Modules/Government/Election/ElectionModule');
const Election = require('../../src/models/Modules/Government/Election/Election');
const ElectionResult = require('../../src/models/Modules/Government/Election/ElectionResult');
const PrimaryElectionResult = require('../../src/models/Modules/Government/Election/PrimaryElectionResult');
const Campaign = require('../../src/models/Modules/Government/Election/Campaign');
const Candidate = require('../../src/models/Modules/Government/Election/Candidate');
const GovernmentPosition = require('../../src/models/Modules/Government/GovernmentPosition');

describe('Election Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Election', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "campaigns", "governmentPosition"';
				const election = new Instance(Election);

				await testForErrorAsync('election.validate()', election.id + expectedErrorMessage, async() => {
					return election.validate();
				});

			});

			describe('Validation - Term Start Date After Election Date', () => {

				it('Error thrown if termStartDate is before electionDate', async() => {
					const expectedErrorMessage = ': Term Start Date must be greater than or equal to Election Date.';
					const election = new Instance(Election);
					const governmentPosition = new Instance(GovernmentPosition);
					const campaigns = new InstanceSet(Campaign, [new Instance(Campaign)]);

					election.assign({
						electionDate: new Date('2000-01-01'),
						termStartDate: new Date('1999-12-31'),
						governmentPosition,
						campaigns,
					});
	
					await testForErrorAsync('election.validate()', election.id + expectedErrorMessage, async() => {
						return election.validate();
					});

				});

				it('No Error thrown if positionStartDate is equal to electionDate', async() => {
					const election = new Instance(Election);
					const governmentPosition = new Instance(GovernmentPosition);
					const campaigns = new InstanceSet(Campaign, [new Instance(Campaign)]);

					election.assign({
						electionDate: new Date('2000-01-01'),
						termStartDate: new Date('2000-01-01'),
						governmentPosition,
						campaigns,
					});
	
					await election.validate();
				});

				it('No Error thrown if positionStartDate is after electionDate', async() => {
					const election = new Instance(Election);
					const governmentPosition = new Instance(GovernmentPosition);
					const campaigns = new InstanceSet(Campaign, [new Instance(Campaign)]);

					election.assign({
						electionDate: new Date('2000-01-01'),
						termStartDate: new Date('2000-01-02'),
						governmentPosition,
						campaigns,
					});
	
					await election.validate();
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

	describe('ClassModel - ElectionResult', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "campaign", "geographicArea"';
				const electionResult = new Instance(ElectionResult);

				await testForErrorAsync('electionResult.validate()', electionResult.id + expectedErrorMessage, async() => {
					return electionResult.validate();
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

	describe('ClassModel - PrimaryElectionResult', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "campaign", "geographicArea"';
				const primaryElectionResult = new Instance(PrimaryElectionResult);

				await testForErrorAsync('primaryElectionResult.validate()', primaryElectionResult.id + expectedErrorMessage, async() => {
					return primaryElectionResult.validate();
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

	describe('ClassModel - Campaign', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "candidate", "election"';
				const campaign = new Instance(Campaign);

				await testForErrorAsync('campaign.validate()', campaign.id + expectedErrorMessage, async() => {
					return campaign.validate();
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

	describe('ClassModel - Candidate', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "campaigns", "person"';
				const candidate = new Instance(Candidate);

				await testForErrorAsync('candidate.validate()', candidate.id + expectedErrorMessage, async() => {
					return candidate.validate();
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
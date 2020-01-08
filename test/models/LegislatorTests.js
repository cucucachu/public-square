/*
	Unit Tests for the Models in the Legislator Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Government/Legislator/LegislatorModule');
const Legislator = require('../../src/models/Government/Legislator/Legislator');
const IndividualLegislativeVote = require('../../src/models/Government/Legislator/IndividualLegislativeVote');
const LegislativeVoteOption = require('../../src/models/Government/Legislator/LegislativeVoteOption');
const LegislativeVote = require('../../src/models/Government/Legislator/LegislativeVote');
const Bill = require('../../src/models/Government/Legislator/Bill');
const BillVersion = require('../../src/models/Government/Legislator/BillVersion');
const BillSponsorship = require('../../src/models/Government/Legislator/BillSponsorship');

describe('Legislator Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Legislator', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
				const legislator = new Instance(Legislator);

				await testForErrorAsync('legislator.validate()', legislator.id + expectedErrorMessage, async() => {
					return legislator.validate();
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

	describe('ClassModel - IndividualLegislativeVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "legislator", "legislativeVote", "legislativeVoteOption"';
				const individualLegislativeVote = new Instance(IndividualLegislativeVote);

				await testForErrorAsync('individualLegislativeVote.validate()', individualLegislativeVote.id + expectedErrorMessage, async() => {
					return individualLegislativeVote.validate();
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

	describe('ClassModel - LegislativeVoteOption', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const legislativeVoteOption = new Instance(LegislativeVoteOption);

				await testForErrorAsync('legislativeVoteOption.validate()', legislativeVoteOption.id + expectedErrorMessage, async() => {
					return legislativeVoteOption.validate();
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

	describe('ClassModel - LegislativeVote', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "date", "billVersion"';
				const legislativeVote = new Instance(LegislativeVote);

				await testForErrorAsync('legislativeVote.validate()', legislativeVote.id + expectedErrorMessage, async() => {
					return legislativeVote.validate();
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

	describe('ClassModel - Bill', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "billVersions", "billSponsorships", "poll"';
				const bill = new Instance(Bill);

				await testForErrorAsync('bill.validate()', bill.id + expectedErrorMessage, async() => {
					return bill.validate();
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

	describe('ClassModel - BillVersion', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "versionNumber", "text", "date", "bill"';
				const billVersion = new Instance(BillVersion);

				await testForErrorAsync('billVersion.validate()', billVersion.id + expectedErrorMessage, async() => {
					return billVersion.validate();
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

	describe('ClassModel - BillSponsorship', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate", "bill", "legislator"';
				const billSponsorship = new Instance(BillSponsorship);

				await testForErrorAsync('billSponsorship.validate()', billSponsorship.id + expectedErrorMessage, async() => {
					return billSponsorship.validate();
				});

			});

			describe('Validation - End Date After Start Date', () => {

				it('Error thrown if endDate is before startDate.', async() => {
					const expectedErrorMessage = ': End Date must be greater than or equal to Start Date.';
					const billSponsorship = new Instance(BillSponsorship);

					billSponsorship.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('1999-12-31'),
						bill: new Instance(Bill),
						legislator: new Instance(Legislator),
					});
	
					await testForErrorAsync('billSponsorship.validate()', billSponsorship.id + expectedErrorMessage, async() => {
						return billSponsorship.validate();
					});

				});

				it('No Error thrown if endDate is equal to startDate.', async() => {
					const billSponsorship = new Instance(BillSponsorship);

					billSponsorship.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-01'),
						bill: new Instance(Bill),
						legislator: new Instance(Legislator),
					});

					await billSponsorship.validate();
				});

				it('No Error thrown if endDate is after startDate.', async() => {
					const billSponsorship = new Instance(BillSponsorship);

					billSponsorship.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-02'),
						bill: new Instance(Bill),
						legislator: new Instance(Legislator),
					});

					await billSponsorship.validate();
				});

				it('No Error thrown if endDate is ommitted.', async() => {
					const billSponsorship = new Instance(BillSponsorship);

					billSponsorship.assign({
						startDate: new Date('2000-01-01'),
						bill: new Instance(Bill),
						legislator: new Instance(Legislator),
					});

					await billSponsorship.validate();
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
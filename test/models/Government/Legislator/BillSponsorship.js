/*
	Unit Tests for Class Model BillSponsorship
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Legislator/LegislatorModule');
const Legislator = require('../../../../src/models/Government/Legislator/Legislator');
const IndividualLegislativeVote = require('../../../../src/models/Government/Legislator/IndividualLegislativeVote');
const LegislativeVoteOption = require('../../../../src/models/Government/Legislator/LegislativeVoteOption');
const LegislativeVote = require('../../../../src/models/Government/Legislator/LegislativeVote');
const Bill = require('../../../../src/models/Government/Legislator/Bill');
const BillVersion = require('../../../../src/models/Government/Legislator/BillVersion');
const BillSponsorship = require('../../../../src/models/Government/Legislator/BillSponsorship');

describe('ClassModel - BillSponsorship', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
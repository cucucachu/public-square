/*
	Unit Tests for Class Model LegislativeVoteOption
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

describe('ClassModel - LegislativeVoteOption', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
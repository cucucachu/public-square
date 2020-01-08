/*
	Unit Tests for Class Model Election
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Election/ElectionModule');
const Election = require('../../../../src/models/Government/Election/Election');
const ElectionResult = require('../../../../src/models/Government/Election/ElectionResult');
const PrimaryElectionResult = require('../../../../src/models/Government/Election/PrimaryElectionResult');
const Campaign = require('../../../../src/models/Government/Election/Campaign');
const Candidate = require('../../../../src/models/Government/Election/Candidate');
const GovernmentPosition = require('../../../../src/models/Government/GovernmentPosition');

describe('ClassModel - Election', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
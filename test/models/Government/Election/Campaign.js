/*
	Unit Tests for Class Model Campaign
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

describe('ClassModel - Campaign', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
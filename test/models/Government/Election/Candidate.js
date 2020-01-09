/*
	Unit Tests for Class Model Candidate
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Election/index');
const Election = require('../../../../src/models/Government/Election/Election');
const ElectionResult = require('../../../../src/models/Government/Election/ElectionResult');
const PrimaryElectionResult = require('../../../../src/models/Government/Election/PrimaryElectionResult');
const Campaign = require('../../../../src/models/Government/Election/Campaign');
const Candidate = require('../../../../src/models/Government/Election/Candidate');
const GovernmentPosition = require('../../../../src/models/Government/GovernmentPosition');

describe('ClassModel - Candidate', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
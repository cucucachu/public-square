/*
	Unit Tests for Class Model IndividualExecutiveVote
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Executive/ExecutiveModule');
const ExecutiveAction = require('../../../../src/models/Government/Executive/ExecutiveAction');
const Executive = require('../../../../src/models/Government/Executive/Executive');
const IndividualExecutiveAction = require('../../../../src/models/Government/Executive/IndividualExecutiveAction');
const GroupExecutiveAction = require('../../../../src/models/Government/Executive/GroupExecutiveAction');
const IndividualExecutiveVote = require('../../../../src/models/Government/Executive/IndividualExecutiveVote');
const ExecutiveVoteOption = require('../../../../src/models/Government/Executive/ExecutiveVoteOption');
const ExecutiveVote = require('../../../../src/models/Government/Executive/ExecutiveVote');
const Poll = require('../../../../src/models/Poll/Poll');

describe('ClassModel - IndividualExecutiveVote', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
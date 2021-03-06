/*
	Unit Tests for Class Model ConfirmationVote
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Nomination/index');
const Nomination = require('../../../../src/models/Government/Nomination/Nomination');
const Nominator = require('../../../../src/models/Government/Nomination/Nominator');
const Nominee = require('../../../../src/models/Government/Nomination/Nominee');
const ConfirmationVote = require('../../../../src/models/Government/Nomination/ConfirmationVote');
const ConfirmationVoteOption = require('../../../../src/models/Government/Nomination/ConfirmationVoteOption');
const IndividualConfirmationVote = require('../../../../src/models/Government/Nomination/IndividualConfirmationVote');
const Confirmer = require('../../../../src/models/Government/Nomination/Confirmer');
const GovernmentPosition = require('../../../../src/models/Government/GovernmentPosition');

describe('ClassModel - ConfirmationVote', () => {
	
    before(async () => {
        await database.connect();
    });
    
    after(async () => {
        await database.close();
    });

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
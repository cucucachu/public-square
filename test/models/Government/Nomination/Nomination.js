/*
	Unit Tests for Class Model Nomination
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

describe('ClassModel - Nomination', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "nominator", "nominee", "governmentPosition"';
            const nomination = new Instance(Nomination);

            await testForErrorAsync('nomination.validate()', nomination.id + expectedErrorMessage, async() => {
                return nomination.validate();
            });

        });

        describe('Validation - Position Start Date After Nomination Date', () => {

            it('Error thrown if positionStartDate is before nominationDate.', async() => {
                const expectedErrorMessage = ': Position Start Date must be greater than or equal to Nomination Date.';
                const nomination = new Instance(Nomination);

                nomination.assign({
                    nominationDate: new Date('2000-01-01'),
                    positionStartDate: new Date('1999-12-31'),
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await testForErrorAsync('nomination.validate()', nomination.id + expectedErrorMessage, async() => {
                    return nomination.validate();
                });

            });

            it('No Error thrown if positionStartDate is equal to nominationDate.', async() => {
                const nomination = new Instance(Nomination);

                nomination.assign({
                    nominationDate: new Date('2000-01-01'),
                    positionStartDate: new Date('2000-01-01'),
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await nomination.validate();
            });

            it('No Error thrown if positionStartDate is after nominationDate.', async() => {
                const nomination = new Instance(Nomination);

                nomination.assign({
                    nominationDate: new Date('2000-01-01'),
                    positionStartDate: new Date('2000-01-02'),
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await nomination.validate();
            });

            it('No Error thrown if positionStartDate is ommitted.', async() => {
                const nomination = new Instance(Nomination);

                nomination.assign({
                    nominationDate: new Date('2000-01-01'),
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await nomination.validate();
            });

            it('No Error thrown if nominationDate is ommitted.', async() => {
                const nomination = new Instance(Nomination);

                nomination.assign({
                    positionStartDate: new Date('1999-12-31'),
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await nomination.validate();
            });

            it('No Error thrown if both positionStartDate and nominationDate are ommitted.', async() => {
                const nomination = new Instance(Nomination);

                nomination.assign({
                    nominator: new Instance(Nominator),
                    nominee: new Instance(Nominee),
                    governmentPosition: new Instance(GovernmentPosition),
                });

                await nomination.validate();
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
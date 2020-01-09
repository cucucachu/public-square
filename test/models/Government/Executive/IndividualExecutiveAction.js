/*
	Unit Tests for Class Model IndividualExecutiveAction
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Executive/index');
const ExecutiveAction = require('../../../../src/models/Government/Executive/ExecutiveAction');
const Executive = require('../../../../src/models/Government/Executive/Executive');
const IndividualExecutiveAction = require('../../../../src/models/Government/Executive/IndividualExecutiveAction');
const GroupExecutiveAction = require('../../../../src/models/Government/Executive/GroupExecutiveAction');
const IndividualExecutiveVote = require('../../../../src/models/Government/Executive/IndividualExecutiveVote');
const ExecutiveVoteOption = require('../../../../src/models/Government/Executive/ExecutiveVoteOption');
const ExecutiveVote = require('../../../../src/models/Government/Executive/ExecutiveVote');
const Poll = require('../../../../src/models/Poll/Poll');

describe('ClassModel - IndividualExecutiveAction', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "name", "text", "poll"';
            const individualExecutiveAction = new Instance(IndividualExecutiveAction);

            await testForErrorAsync('individualExecutiveAction.validate()', individualExecutiveAction.id + expectedErrorMessage, async() => {
                return individualExecutiveAction.validate();
            });

        });

        describe('Validation - Effective Date After Passed Date', () => {

            it('Error thrown if effectiveDate is before passedDate.', async() => {
                const expectedErrorMessage = ': Effective Date must be greater than or equal to Passed Date.';
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    passedDate: new Date('2000-01-01'),
                    effectiveDate: new Date('1999-12-31'),
                    poll,
                });

                await testForErrorAsync('individualExecutiveAction.validate()', individualExecutiveAction.id + expectedErrorMessage, async() => {
                    return individualExecutiveAction.validate();
                });

            });

            it('No Error thrown if effectiveDate is equal to passedDate.', async() => {
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    passedDate: new Date('2000-01-01'),
                    effectiveDate: new Date('2000-01-01'),
                    poll,
                });

                await individualExecutiveAction.validate();
            });

            it('No Error thrown if effectiveDate is after passedDate.', async() => {
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    passedDate: new Date('2000-01-01'),
                    effectiveDate: new Date('2000-01-02'),
                    poll,
                });

                await individualExecutiveAction.validate();
            });

            it('No Error thrown if effectiveDate is not given.', async() => {
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    passedDate: new Date('2000-01-01'),
                    poll,
                });

                await individualExecutiveAction.validate();
            });

            it('No Error thrown if passedDate is not given.', async() => {
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    effectiveDate: new Date('2000-01-02'),
                    poll,
                });

                await individualExecutiveAction.validate();
            });

            it('No Error thrown if passedDate and effective date are not given.', async() => {
                const individualExecutiveAction = new Instance(IndividualExecutiveAction);
                const poll = new Instance(Poll);

                individualExecutiveAction.assign({
                    name: 'Public Square Act',
                    text: 'Make Public Square the Best.',
                    poll,
                });

                await individualExecutiveAction.validate();
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
/*
	Unit Tests for Class Model IndividualJudgement
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Judge/JudgeModule');
const Judge = require('../../../../src/models/Government/Judge/Judge');
const IndividualJudgement = require('../../../../src/models/Government/Judge/IndividualJudgement');
const JudgementOption = require('../../../../src/models/Government/Judge/JudgementOption');
const Judgement = require('../../../../src/models/Government/Judge/Judgement');
const JudicialCase = require('../../../../src/models/Government/Judge/JudicialCase');
const JudicialOpinion = require('../../../../src/models/Government/Judge/JudicialOpinion');

describe('ClassModel - IndividualJudgement', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "judge", "judgement", "judgementOption"';
            const individualJudgement = new Instance(IndividualJudgement);

            await testForErrorAsync('individualJudgement.validate()', individualJudgement.id + expectedErrorMessage, async() => {
                return individualJudgement.validate();
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

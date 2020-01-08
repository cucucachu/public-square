/*
	Unit Tests for Class Model JudicialCase
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

describe('ClassModel - JudicialCase', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "name"';
            const judicialCase = new Instance(JudicialCase);

            await testForErrorAsync('judicialCase.validate()', judicialCase.id + expectedErrorMessage, async() => {
                return judicialCase.validate();
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
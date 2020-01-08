/*
	Unit Tests for the Models in the Judge Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Government/Judge/JudgeModule');
const Judge = require('../../src/models/Government/Judge/Judge');
const IndividualJudgement = require('../../src/models/Government/Judge/IndividualJudgement');
const JudgementOption = require('../../src/models/Government/Judge/JudgementOption');
const Judgement = require('../../src/models/Government/Judge/Judgement');
const JudicialCase = require('../../src/models/Government/Judge/JudicialCase');
const JudicialOpinion = require('../../src/models/Government/Judge/JudicialOpinion');

describe('Judge Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Judge', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
				const judge = new Instance(Judge);

				await testForErrorAsync('judge.validate()', judge.id + expectedErrorMessage, async() => {
					return judge.validate();
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

	describe('ClassModel - IndividualJudgement', () => {

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

	describe('ClassModel - JudgementOption', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const judgementOption = new Instance(JudgementOption);

				await testForErrorAsync('judgementOption.validate()', judgementOption.id + expectedErrorMessage, async() => {
					return judgementOption.validate();
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

	describe('ClassModel - Judgement', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "date", "judicialCase", "poll"';
				const judgement = new Instance(Judgement);

				await testForErrorAsync('judgement.validate()', judgement.id + expectedErrorMessage, async() => {
					return judgement.validate();
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

	describe('ClassModel - JudicialCase', () => {

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

	describe('ClassModel - JudicialOpinion', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "text", "poll"';
				const judicialOpinion = new Instance(JudicialOpinion);

				await testForErrorAsync('judicialOpinion.validate()', judicialOpinion.id + expectedErrorMessage, async() => {
					return judicialOpinion.validate();
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

});
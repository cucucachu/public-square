/*
	Unit Tests for Class Model VoteOption
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Government/GovernmentModule');
const VoteOption = require('../../../src/models/Government/VoteOption');
const GovernmentRole = require('../../../src/models/Government/GovernmentRole');
const PositionAcquisitionProcess = require('../../../src/models/Government/PositionAcquisitionProcess');
const EffectivePositionDefinition = require('../../../src/models/Government/EffectivePositionDefinition');
const Government = require('../../../src/models/Government/Government');
const GovernmentInstitution = require('../../../src/models/Government/GovernmentInstitution');
const GovernmentOfficial = require('../../../src/models/Government/GovernmentOfficial');
const GovernmentPosition = require('../../../src/models/Government/GovernmentPosition');
const GovernmentPower = require('../../../src/models/Government/GovernmentPower');
const Law = require('../../../src/models/Government/Law');
const OccupiedPosition = require('../../../src/models/Government/OccupiedPosition');
const PositionDefinition = require('../../../src/models/Government/PositionDefinition');
const TermDefinition = require('../../../src/models/Government/TermDefinition');
const Poll = require('../../../src/models/Poll/Poll');

describe('ClassModel - VoteOption', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown when calling new Instance for abstract class.', async() => {
            const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

            testForError('new Instance(VoteOption)', expectedErrorMessage, () => {
                new Instance(VoteOption);
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
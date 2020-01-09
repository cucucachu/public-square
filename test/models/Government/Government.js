/*
	Unit Tests for Class Model Government
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Government/index');
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

describe('ClassModel - Government', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "name", "createdDate", "geographicArea", "poll"';
            const government = new Instance(Government);

            await testForErrorAsync('government.validate()', government.id + expectedErrorMessage, async() => {
                return government.validate();
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
/*
	Unit Tests for Class Model OccupiedPosition
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

describe('ClassModel - OccupiedPosition', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "startDate", "governmentPosition", "governmentOfficial", "poll"';
            const occupiedPosition = new Instance(OccupiedPosition);

            await testForErrorAsync('occupiedPosition.validate()', occupiedPosition.id + expectedErrorMessage, async() => {
                return occupiedPosition.validate();
            });

        });

        describe('Validation - End Date After Start Date', () => {

            it('Error thrown if endDate is before startDate.', async() => {
                const expectedErrorMessage = ': End Date must be greater than or equal to Start Date.';
                const occupiedPosition = new Instance(OccupiedPosition);

                occupiedPosition.assign({
                    startDate: new Date('2000-01-01'),
                    endDate: new Date('1999-12-31'),
                    poll: new Instance(Poll),
                    governmentPosition: new Instance(GovernmentPosition),
                    governmentOfficial: new Instance(GovernmentOfficial),
                });

                await testForErrorAsync('occupiedPosition.validate()', occupiedPosition.id + expectedErrorMessage, async() => {
                    return occupiedPosition.validate();
                });

            });

            it('No Error thrown if endDate is equal to startDate.', async() => {
                const occupiedPosition = new Instance(OccupiedPosition);

                occupiedPosition.assign({
                    startDate: new Date('2000-01-01'),
                    endDate: new Date('2000-01-01'),
                    poll: new Instance(Poll),
                    governmentPosition: new Instance(GovernmentPosition),
                    governmentOfficial: new Instance(GovernmentOfficial),
                });

                await occupiedPosition.validate();
            });

            it('No Error thrown if endDate is after startDate.', async() => {
                const occupiedPosition = new Instance(OccupiedPosition);

                occupiedPosition.assign({
                    startDate: new Date('2000-01-01'),
                    endDate: new Date('2000-01-02'),
                    poll: new Instance(Poll),
                    governmentPosition: new Instance(GovernmentPosition),
                    governmentOfficial: new Instance(GovernmentOfficial),
                });

                await occupiedPosition.validate();
            });

            it('No Error thrown if endDate is ommitted.', async() => {
                const occupiedPosition = new Instance(OccupiedPosition);

                occupiedPosition.assign({
                    startDate: new Date('2000-01-01'),
                    poll: new Instance(Poll),
                    governmentPosition: new Instance(GovernmentPosition),
                    governmentOfficial: new Instance(GovernmentOfficial),
                });

                await occupiedPosition.validate();
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
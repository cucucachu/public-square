/*
	Unit Tests for Class Model Appointer
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Appointment/AppointmentModule');
const Appointment = require('../../../../src/models/Government/Appointment/Appointment');
const Appointer = require('../../../../src/models/Government/Appointment/Appointer');
const Appointee = require('../../../../src/models/Government/Appointment/Appointee');
const GovernmentPosition = require('../../../../src/models/Government/GovernmentPosition');

describe('ClassModel - Appointer', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "occupiedPosition"';
            const appointer = new Instance(Appointer);

            await testForErrorAsync('appointer.validate()', appointer.id + expectedErrorMessage, async() => {
                return appointer.validate();
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
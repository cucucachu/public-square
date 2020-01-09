/*
	Unit Tests for Class Model Appointee
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../../helpers/database');
const testingFunctions = require('../../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../../src/models/Government/Appointment/index');
const Appointment = require('../../../../src/models/Government/Appointment/Appointment');
const Appointer = require('../../../../src/models/Government/Appointment/Appointer');
const Appointee = require('../../../../src/models/Government/Appointment/Appointee');
const GovernmentPosition = require('../../../../src/models/Government/GovernmentPosition');

describe('ClassModel - Appointee', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "appointments", "person"';
            const appointee = new Instance(Appointee);

            await testForErrorAsync('appointer.validate()', appointee.id + expectedErrorMessage, async() => {
                return appointee.validate();
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
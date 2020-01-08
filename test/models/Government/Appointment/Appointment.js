/*
	Unit Tests for Class Model Appointment
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

describe('ClassModel - Appointment', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "appointer", "appointee", "governmentPosition"';
            const appointment = new Instance(Appointment);

            await testForErrorAsync('appointment.validate()', appointment.id + expectedErrorMessage, async() => {
                return appointment.validate();
            });

        });

        describe('Validation - Start Date After Appointment Date', () => {

            it('Error thrown if positionStartDate is before appointmentDate', async() => {
                const expectedErrorMessage = ': Term Start Date must be greater than or equal to Appointment Date.';
                const appointment = new Instance(Appointment);
                const appointer = new Instance(Appointer);
                const appointee = new Instance(Appointee);
                const governmentPosition = new Instance(GovernmentPosition);

                appointment.assign({
                    appointmentDate: new Date('2000-01-01'),
                    positionStartDate: new Date('1999-12-31'),
                    appointer,
                    appointee,
                    governmentPosition,
                });

                await testForErrorAsync('appointment.validate()', appointment.id + expectedErrorMessage, async() => {
                    return appointment.validate();
                });

            });

            it('No Error thrown if positionStartDate is equal to appointmentDate.', async() => {
                const appointment = new Instance(Appointment);
                const appointer = new Instance(Appointer);
                const appointee = new Instance(Appointee);
                const governmentPosition = new Instance(GovernmentPosition);

                appointment.assign({
                    appointmentDate: new Date('2000-01-01'),
                    positionStartDate: new Date('2000-01-01'),
                    appointer,
                    appointee,
                    governmentPosition,
                });

                await appointment.validate();
            });

            it('No Error thrown if positionStartDate is after appointmentDate.', async() => {
                const appointment = new Instance(Appointment);
                const appointer = new Instance(Appointer);
                const appointee = new Instance(Appointee);
                const governmentPosition = new Instance(GovernmentPosition);

                appointment.assign({
                    appointmentDate: new Date('2000-01-01'),
                    positionStartDate: new Date('2000-01-02'),
                    appointer,
                    appointee,
                    governmentPosition,
                });

                await appointment.validate();
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
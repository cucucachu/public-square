/*
	Unit Tests for the Models in the Appointment Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Modules/Government/Appointment/AppointmentModule');
const Appointment = require('../../src/models/Modules/Government/Appointment/Appointment');
const Appointer = require('../../src/models/Modules/Government/Appointment/Appointer');
const Appointee = require('../../src/models/Modules/Government/Appointment/Appointee');
const GovernmentPosition = require('../../src/models/Modules/Government/GovernmentPosition');

describe('Appointment Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Appointment', () => {

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

	describe('ClassModel - Appointer', () => {

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

	describe('ClassModel - Appointee', () => {

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
});
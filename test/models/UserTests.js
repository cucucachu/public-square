/*
	Unit Tests for the Models in the User Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/User/UserModule')
const UserRole = require('../../src/models/User/UserRole');
const PersonRole = require('../../src/models/User/PersonRole');
const Person = require('../../src/models/User/Person');
const UserAccount = require('../../src/models/User/UserAccount');
const AuthToken = require('../../src/models/User/AuthToken');

describe('User Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Person', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "firstName", "lastName"';
				const person = new Instance(Person);

				await testForErrorAsync('person.validate()', person.id + expectedErrorMessage, async() => {
					return person.validate();
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

	describe('ClassModel - UserAccount', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "email", "passwordHash", "person"';
				const userAccount = new Instance(UserAccount);

				await testForErrorAsync('userAccount.validate()', userAccount.id + expectedErrorMessage, async() => {
					return userAccount.validate();
				});

			});

			describe('Email Validation', () => {

				it('Error thrown when email is not valid.', async () => {
					const expectedErrorMessage = ': Invalid Email';
					const userAccount = new Instance(UserAccount);
					const person = new Instance(Person);

					userAccount.assign({
						email: 'hello',
						passwordHash: '209833urj0iegm04rtmijgaff',
						person: person,
					});

					await testForErrorAsync('userAccount.validate()', userAccount.id + expectedErrorMessage, async() => {
						return userAccount.validate();
					});

				});

				it('No error thrown when email is valid.', async () => {
					const expectedErrorMessage = ': Invalid Email';
					const userAccount = new Instance(UserAccount);
					const person = new Instance(Person);

					userAccount.assign({
						email: 'hello@hithere.com',
						passwordHash: '209833urj0iegm04rtmijgaff',
						person: person,
					});

					await userAccount.validate();
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

	describe('ClassModel - AuthToken', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "createdAt", "expiresAt", "userAccount"';
				const authToken = new Instance(AuthToken);

				await testForErrorAsync('authToken.validate()', authToken.id + expectedErrorMessage, async() => {
					return authToken.validate();
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

	describe('ClassModel - PersonRole', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance for abstract class.', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				testForError('new Instance(PersonRole)', expectedErrorMessage, () => {
					new Instance(PersonRole);
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

	describe('ClassModel - UserRole', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance for abstract class.', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				testForError('new Instance(UserRole)', expectedErrorMessage, () => {
					new Instance(UserRole);
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
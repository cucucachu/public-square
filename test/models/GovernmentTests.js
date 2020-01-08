/*
	Unit Tests for the Models in the Government Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Government/GovernmentModule');
const VoteOption = require('../../src/models/Government/VoteOption');
const GovernmentRole = require('../../src/models/Government/GovernmentRole');
const PositionAcquisitionProcess = require('../../src/models/Government/PositionAcquisitionProcess');
const EffectivePositionDefinition = require('../../src/models/Government/EffectivePositionDefinition');
const Government = require('../../src/models/Government/Government');
const GovernmentInstitution = require('../../src/models/Government/GovernmentInstitution');
const GovernmentOfficial = require('../../src/models/Government/GovernmentOfficial');
const GovernmentPosition = require('../../src/models/Government/GovernmentPosition');
const GovernmentPower = require('../../src/models/Government/GovernmentPower');
const Law = require('../../src/models/Government/Law');
const OccupiedPosition = require('../../src/models/Government/OccupiedPosition');
const PositionDefinition = require('../../src/models/Government/PositionDefinition');
const TermDefinition = require('../../src/models/Government/TermDefinition');
const Poll = require('../../src/models/Poll/Poll');

describe('Government Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - VoteOption', () => {

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

	describe('ClassModel - GovernmentRole', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance for abstract class.', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				testForError('new Instance(GovernmentRole)', expectedErrorMessage, () => {
					new Instance(GovernmentRole);
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

	describe('ClassModel - PositionAcquisitionProcess', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown when calling new Instance for abstract class.', async() => {
				const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

				testForError('new Instance(PositionAcquisitionProcess)', expectedErrorMessage, () => {
					new Instance(PositionAcquisitionProcess);
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

	describe('ClassModel - EffectivePositionDefinition', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate", "governmentPosition", "positionDefinition"';
				const effectivePositionDefinition = new Instance(EffectivePositionDefinition);

				await testForErrorAsync('effectivePositionDefinition.validate()', effectivePositionDefinition.id + expectedErrorMessage, async() => {
					return effectivePositionDefinition.validate();
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

	describe('ClassModel - Government', () => {

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

	describe('ClassModel - GovernmentInstitution', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "poll"';
				const governmentInstitution = new Instance(GovernmentInstitution);

				await testForErrorAsync('governmentInstitution.validate()', governmentInstitution.id + expectedErrorMessage, async() => {
					return governmentInstitution.validate();
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

	describe('ClassModel - GovernmentOfficial', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "person"';
				const governmentOfficial = new Instance(GovernmentOfficial);

				await testForErrorAsync('governmentOfficial.validate()', governmentOfficial.id + expectedErrorMessage, async() => {
					return governmentOfficial.validate();
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

	describe('ClassModel - GovernmentPosition', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "title", "governmentInstitution"';
				const governmentPosition = new Instance(GovernmentPosition);

				await testForErrorAsync('governmentPosition.validate()', governmentPosition.id + expectedErrorMessage, async() => {
					return governmentPosition.validate();
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

	describe('ClassModel - GovernmentPower', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const governmentPower = new Instance(GovernmentPower);

				await testForErrorAsync('governmentPower.validate()', governmentPower.id + expectedErrorMessage, async() => {
					return governmentPower.validate();
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

	describe('ClassModel - Law', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate"';
				const law = new Instance(Law);

				await testForErrorAsync('law.validate()', law.id + expectedErrorMessage, async() => {
					return law.validate();
				});

			});

			describe('Validation - Expire Date After Start Date', () => {

				it('Error thrown if expireDate is before startDate.', async() => {
					const expectedErrorMessage = ': Expire Date must be greater than or equal to Start Date.';
					const law = new Instance(Law);

					law.assign({
						startDate: new Date('2000-01-01'),
						expireDate: new Date('1999-12-31'),
					});
	
					await testForErrorAsync('law.validate()', law.id + expectedErrorMessage, async() => {
						return law.validate();
					});

				});

				it('No Error thrown if expireDate is equal to startDate.', async() => {
					const law = new Instance(Law);

					law.assign({
						startDate: new Date('2000-01-01'),
						expireDate: new Date('2000-01-01'),
					});
	
					await law.validate();
				});

				it('No Error thrown if expireDate is after startDate.', async() => {
					const law = new Instance(Law);

					law.assign({
						startDate: new Date('2000-01-01'),
						expireDate: new Date('2000-01-02'),
					});
	
					await law.validate();
				});

				it('No Error thrown if expireDate is ommitted.', async() => {
					const law = new Instance(Law);

					law.assign({
						startDate: new Date('2000-01-01'),
						expireDate: new Date('2000-01-02'),
					});
	
					await law.validate();
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

	describe('ClassModel - OccupiedPosition', () => {

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

	describe('ClassModel - PositionDefinition', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name"';
				const positionDefinition = new Instance(PositionDefinition);

				await testForErrorAsync('positionDefinition.validate()', positionDefinition.id + expectedErrorMessage, async() => {
					return positionDefinition.validate();
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

	describe('ClassModel - TermDefinition', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "termLength", "termLimit"';
				const termDefinition = new Instance(TermDefinition);

				await testForErrorAsync('termDefinition.validate()', termDefinition.id + expectedErrorMessage, async() => {
					return termDefinition.validate();
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
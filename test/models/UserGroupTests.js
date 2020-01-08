/*
	Unit Tests for the Models in the UserGroup Module
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/UserGroup/UserGroupModule');
const UserGroup = require('../../src/models/UserGroup/UserGroup');
const GroupManager = require('../../src/models/UserGroup/GroupManager');
const GroupMember = require('../../src/models/UserGroup/GroupMember');
const GroupEvent = require('../../src/models/UserGroup/GroupEvent');
const Organization = require('../../src/models/UserGroup/Organization');
const OrganizationMember = require('../../src/models/UserGroup/OrganizationMember');
const UserAccount = require('../../src/models/User/UserAccount');
const Address = require('../../src/models/Geography/Address');

describe('UserGroup Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - UserGroup', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "createdAt", "groupManagers"';
				const userGroup = new Instance(UserGroup);

				await testForErrorAsync('userGroup.validate()', userGroup.id + expectedErrorMessage, async() => {
					return userGroup.validate();
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

	describe('ClassModel - GroupManager', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate", "userGroup", "userAccount"';
				const groupManager = new Instance(GroupManager);

				await testForErrorAsync('groupManager.validate()', groupManager.id + expectedErrorMessage, async() => {
					return groupManager.validate();
				});

			});

			describe('Validation - End Date After Start Date', () => {

				it('Error thrown if endDate is before startDate.', async() => {
					const expectedErrorMessage = ': End Date must be greater than or equal to Start Date.';
					const groupManager = new Instance(GroupManager);

					groupManager.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('1999-12-31'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});
	
					await testForErrorAsync('groupManager.validate()', groupManager.id + expectedErrorMessage, async() => {
						return groupManager.validate();
					});

				});

				it('No Error thrown if endDate is equal to startDate.', async() => {
					const groupManager = new Instance(GroupManager);

					groupManager.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-01'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupManager.validate();
				});

				it('No Error thrown if endDate is after startDate.', async() => {
					const groupManager = new Instance(GroupManager);

					groupManager.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-02'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupManager.validate();
				});

				it('No Error thrown if endDate is ommitted.', async() => {
					const groupManager = new Instance(GroupManager);

					groupManager.assign({
						startDate: new Date('2000-01-01'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupManager.validate();
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

	describe('ClassModel - GroupMember', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate", "userGroup", "userAccount"';
				const groupMember = new Instance(GroupMember);

				await testForErrorAsync('groupMember.validate()', groupMember.id + expectedErrorMessage, async() => {
					return groupMember.validate();
				});

			});

			describe('Validation - End Date After Start Date', () => {

				it('Error thrown if endDate is before startDate.', async() => {
					const expectedErrorMessage = ': End Date must be greater than or equal to Start Date.';
					const groupMember = new Instance(GroupMember);

					groupMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('1999-12-31'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});
	
					await testForErrorAsync('groupMember.validate()', groupMember.id + expectedErrorMessage, async() => {
						return groupMember.validate();
					});

				});

				it('No Error thrown if endDate is equal to startDate.', async() => {
					const groupMember = new Instance(GroupMember);

					groupMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-01'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupMember.validate();
				});

				it('No Error thrown if endDate is after startDate.', async() => {
					const groupMember = new Instance(GroupMember);

					groupMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-02'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupMember.validate();
				});

				it('No Error thrown if endDate is ommitted.', async() => {
					const groupMember = new Instance(GroupMember);

					groupMember.assign({
						startDate: new Date('2000-01-01'),
						userGroup: new Instance(UserGroup),
						userAccount: new Instance(UserAccount),
					});

					await groupMember.validate();
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

	describe('ClassModel - GroupEvent', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startTime", "endTime", "name", "createdAt", "addresses", "groupManagers"';
				const groupEvent = new Instance(GroupEvent);

				await testForErrorAsync('groupEvent.validate()', groupEvent.id + expectedErrorMessage, async() => {
					return groupEvent.validate();
				});

			});

			describe('Validation - End Date After Start Date', () => {

				it('Error thrown if endDate is before startDate.', async() => {
					const expectedErrorMessage = ': End Time must be greater than or equal to Start Time.';
					const groupEvent = new Instance(GroupEvent);

					groupEvent.assign({
						startTime: new Date('2000-01-01'),
						endTime: new Date('1999-12-31'),
						name: 'bobs event',
						createdAt: new Date(),
						addresses: new InstanceSet(Address, [new Instance(Address)]),
						groupManagers: new InstanceSet(GroupManager, [new Instance(GroupManager)]),
					});
	
					await testForErrorAsync('groupEvent.validate()', groupEvent.id + expectedErrorMessage, async() => {
						return groupEvent.validate();
					});

				});

				it('No Error thrown if endTime is equal to startTime.', async() => {
					const groupEvent = new Instance(GroupEvent);

					groupEvent.assign({
						startTime: new Date('2000-01-01'),
						endTime: new Date('2000-01-01'),
						name: 'bobs event',
						createdAt: new Date(),
						addresses: new InstanceSet(Address, [new Instance(Address)]),
						groupManagers: new InstanceSet(GroupManager, [new Instance(GroupManager)]),
					});

					await groupEvent.validate();
				});

				it('No Error thrown if endTime is after startTime.', async() => {
					const groupEvent = new Instance(GroupEvent);

					groupEvent.assign({
						startTime: new Date('2000-01-01'),
						endTime: new Date('2000-01-02'),
						name: 'bobs event',
						createdAt: new Date(),
						addresses: new InstanceSet(Address, [new Instance(Address)]),
						groupManagers: new InstanceSet(GroupManager, [new Instance(GroupManager)]),
					});

					await groupEvent.validate();
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

	describe('ClassModel - Organization', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "createdAt", "groupManagers"';
				const organization = new Instance(Organization);

				await testForErrorAsync('organization.validate()', organization.id + expectedErrorMessage, async() => {
					return organization.validate();
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

	describe('ClassModel - OrganizationMember', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "startDate", "organization", "userAccount"';
				const organizationMember = new Instance(OrganizationMember);

				await testForErrorAsync('organizationMember.validate()', organizationMember.id + expectedErrorMessage, async() => {
					return organizationMember.validate();
				});

			});

			describe('Validation - End Date After Start Date', () => {

				it('Error thrown if endDate is before startDate.', async() => {
					const expectedErrorMessage = ': End Date must be greater than or equal to Start Date.';
					const organizationMember = new Instance(OrganizationMember);

					organizationMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('1999-12-31'),
						organization: new Instance(Organization),
						userAccount: new Instance(UserAccount),
					});
	
					await testForErrorAsync('organizationMember.validate()', organizationMember.id + expectedErrorMessage, async() => {
						return organizationMember.validate();
					});

				});

				it('No Error thrown if endDate is equal to startDate.', async() => {
					const organizationMember = new Instance(OrganizationMember);

					organizationMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-01'),
						organization: new Instance(Organization),
						userAccount: new Instance(UserAccount),
					});

					await organizationMember.validate();
				});

				it('No Error thrown if endDate is after startDate.', async() => {
					const organizationMember = new Instance(OrganizationMember);

					organizationMember.assign({
						startDate: new Date('2000-01-01'),
						endDate: new Date('2000-01-02'),
						organization: new Instance(Organization),
						userAccount: new Instance(UserAccount),
					});

					await organizationMember.validate();
				});

				it('No Error thrown if endDate is ommitted.', async() => {
					const organizationMember = new Instance(OrganizationMember);

					organizationMember.assign({
						startDate: new Date('2000-01-01'),
						organization: new Instance(Organization),
						userAccount: new Instance(UserAccount),
					});

					await organizationMember.validate();
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
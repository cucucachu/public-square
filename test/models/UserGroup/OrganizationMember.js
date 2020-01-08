/*
	Unit Tests for Class Model OrganizationMember
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/UserGroup/UserGroupModule');
const UserGroup = require('../../../src/models/UserGroup/UserGroup');
const GroupManager = require('../../../src/models/UserGroup/GroupManager');
const GroupMember = require('../../../src/models/UserGroup/GroupMember');
const GroupEvent = require('../../../src/models/UserGroup/GroupEvent');
const Organization = require('../../../src/models/UserGroup/Organization');
const OrganizationMember = require('../../../src/models/UserGroup/OrganizationMember');
const UserAccount = require('../../../src/models/User/UserAccount');
const Address = require('../../../src/models/Geography/Address');

describe('ClassModel - OrganizationMember', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
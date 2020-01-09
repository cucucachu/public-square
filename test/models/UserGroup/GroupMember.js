/*
	Unit Tests for Class Model GroupMember
 */

const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/UserGroup/index');
const UserGroup = require('../../../src/models/UserGroup/UserGroup');
const GroupManager = require('../../../src/models/UserGroup/GroupManager');
const GroupMember = require('../../../src/models/UserGroup/GroupMember');
const GroupEvent = require('../../../src/models/UserGroup/GroupEvent');
const Organization = require('../../../src/models/UserGroup/Organization');
const OrganizationMember = require('../../../src/models/UserGroup/OrganizationMember');
const UserAccount = require('../../../src/models/User/UserAccount');
const Address = require('../../../src/models/Geography/Address');

describe('ClassModel - GroupMember', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
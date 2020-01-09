/*
	Unit Tests for Class Model GroupEvent
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

describe('ClassModel - GroupEvent', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
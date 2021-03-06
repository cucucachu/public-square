/*
	Unit Tests for Class Model Organization
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

describe('ClassModel - Organization', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

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
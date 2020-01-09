/*
	Unit Tests for the Class Model Address
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Geography/index');
const Address = require('../../../src/models/Geography/Address');

describe('ClassModel - Address', () => {

    before(async () => {
        await database.connect();
    });
    
    after(async () => {
        await database.close();
    });

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "city", "state"';
            const address = new Instance(Address);

            await testForErrorAsync('address.validate()', address.id + expectedErrorMessage, async() => {
                return address.validate();
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
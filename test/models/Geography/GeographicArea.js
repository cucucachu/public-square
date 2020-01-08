/*
	Unit Tests for the Class Model GeographicArea
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Geography/GeographyModule');
const GeographicArea = require('../../../src/models/Geography/GeographicArea');

describe('ClassModel - GeographicArea', () => {
    
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "name", "geographicMapForArea"';
            const geographicArea = new Instance(GeographicArea);

            await testForErrorAsync('geographicArea.validate()', geographicArea.id + expectedErrorMessage, async() => {
                return geographicArea.validate();
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
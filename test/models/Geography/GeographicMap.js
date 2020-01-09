/*
	Unit Tests for the Class Model GeographicMap
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../../helpers/database');
const testingFunctions = require('../../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../../src/models/Geography/index');
const GeographicMap = require('../../../src/models/Geography/GeographicMap');

describe('ClassModel - GeographicMap', () => {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

    describe('Requirements and Validations', () => {

        it('Error thrown if required fields are not set.', async() => {
            const expectedErrorMessage = ': Missing required property(s): "name", "OfGeographicArea", "containsGeographicAreas", "mapType"';
            const geographicMap = new Instance(GeographicMap);

            await testForErrorAsync('geographicMap.validate()', geographicMap.id + expectedErrorMessage, async() => {
                return geographicMap.validate();
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
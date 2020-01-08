/*
	Unit Tests for the Models in the Geography Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const database = require('../helpers/database');
const testingFunctions = require('../helpers/TestingFunctions');
const testForErrorAsync = testingFunctions.testForErrorAsync;
const testForError = testingFunctions.testForError;

require('../../src/models/Modules/Geography/GeographyModule');
const Address = require('../../src/models/Modules/Geography/Address');
const GeographicArea = require('../../src/models/Modules/Geography/GeographicArea');
const GeographicMap = require('../../src/models/Modules/Geography/GeographicMap');
const MapType = require('../../src/models/Modules/Geography/MapType');

describe('Geography Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});

	describe('ClassModel - Address', () => {

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

	describe('ClassModel - GeographicArea', () => {

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

	describe('ClassModel - GeographicMap', () => {

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

	describe('ClassModel - MapType', () => {

		describe('Requirements and Validations', () => {

			it('Error thrown if required fields are not set.', async() => {
				const expectedErrorMessage = ': Missing required property(s): "name", "geographicMaps"';
				const mapType = new Instance(MapType);

				await testForErrorAsync('mapType.validate()', mapType.id + expectedErrorMessage, async() => {
					return mapType.validate();
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
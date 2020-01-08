/*
	Unit Tests for the Models in the Nomination Module
 */


const noomman = require('noomman');
const Instance = noomman.Instance;
const InstanceSet = noomman.Instance;
const database = require('../helpers/database');

require('../../src/models/Modules/Government/Nomination/NominationModule');

describe('Nomination Module Tests', function() {
	
	before(async () => {
		await database.connect();
	});
	
	after(async () => {
		await database.close();
	});
});
/* 
 Mongoose Schema and Model Functions
 Model: Government Official
 Description: A User Role connecting a Person to Occupied Positions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var OccupiedPosition = require('./OccupiedPosition');
var UserRole = require('../User/UserRole');

// Schema and Model Setup
var GovernmentOfficialSchema = new Schema({
    occupiedPositions: {
        type: [Schema.Types.ObjectId],
        ref: 'OccupiedPosition',
    }
});

var GovernmentOfficial = UserRole.Model.discriminator('GovernmentOfficial', GovernmentOfficialSchema);

//Methods 

// Create Method
var create = function() {
	return new GovernmentOfficial({
        _id: new mongoose.Types.ObjectId(),
        startDate: new Date()
	});
}

// Save
var save = function(governmentOfficial, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		governmentOfficial.save(function(err, saved) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(saved);
			}
		});
	});
}


// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(governmentOfficial1, governmentOfficial2) {
    var match = true;
    var message = '';

	if (governmentOfficial1.occupiedPositions != null && governmentOfficial2.occupiedPositions != null) {
		if (governmentOfficial1.occupiedPositions.length != governmentOfficial2.occupiedPositions.length) {
			match = false;
			message += "Occupied Positions do not match. \n";
		}
		else {
			for (var i = 0; i < governmentOfficial1.occupiedPositions.length; i++) {
				if (governmentOfficial1.occupiedPositions[i] != governmentOfficial2.occupiedPositions[i]) {
					match = false;
					message += "Occupied Positions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Government Officials Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GovernmentOfficial.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GovernmentOfficial;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


/* 
 Mongoose Schema and Model Functions
 Model: Government Role
 Description: A abstract super class connecting an Occupied Position to different classes that enable functionallity based on the Government Powers
    for the Government Position. Subclasses include Executive, Judge, Legislator, Nominator, and Confirmer.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var OccupiedPosition = require('./OccupiedPosition');

// Schema and Model Setup
var GovernmentRoleSchema = new Schema({
    occupiedPosition: {
        type: Schema.Types.ObjectId,
        ref: 'OccupiedPosition',
        required: true
    }
});

var GovernmentRole = mongoose.model('GovernmentRole', GovernmentRoleSchema);

//Methods 

// Create Method
var create = function() {
	return new GovernmentRole({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(governmentRole, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		governmentRole.save(function(err, saved) {
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
var compare = function(governmentRole1, governmentRole2) {
    var match = true;
    var message = '';

    if (governmentRole1.occupiedPosition != governmentRole2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + governmentRole1.occupiedPosition +' != ' + governmentRole2.occupiedPosition + '\n';
    }

	if (match)
		message = 'Government Roles Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GovernmentRole.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GovernmentRole;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


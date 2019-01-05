/* 
 Mongoose Schema and Model Functions
 Model: Occupied Position
 Description: Definies who is in a particular Government Position at a particular time. Also relates to different Government Roles, which enable
    different functionallity, depending on the Government Powers defined for the Government Position.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GovernemntPosition = require('./GovernmentPosition');
var GovernmentOfficial = require('./GovernmentOfficial');
var GovernmentRole = require('./GovernmentRole');

// Schema and Model Setup
var OccupiedPositionSchema = new Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date
    },
    governmentPosition: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentPosition',
        required: true
    },
    governmentOfficial: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentOfficial',
        required: true
    },
    governmentRoles: {
        type: [Schema.Types.ObjectId],
        ref: 'GovernmentRole',
    }
});

var OccupiedPosition = mongoose.model('OccupiedPosition', OccupiedPositionSchema);

//Methods 

// Create Method
var create = function() {
	return new OccupiedPosition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(occupiedPosition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		occupiedPosition.save(function(err, saved) {
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
var compare = function(occupiedPosition1, occupiedPosition2) {
    var match = true;
    var message = '';

    if (occupiedPosition1.governmentPosition != occupiedPosition2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + occupiedPosition1.governmentPosition +' != ' + occupiedPosition2.governmentPosition + '\n';
    }

    if (occupiedPosition1.governmentOfficial != occupiedPosition2.governmentOfficial) {
        match = false;
        message += 'Government Officials do not match. ' + occupiedPosition1.governmentOfficial +' != ' + occupiedPosition2.governmentOfficial + '\n';
    }

    if (occupiedPosition1.startDate != occupiedPosition2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + occupiedPosition1.startDate +' != ' + occupiedPosition2.startDate + '\n';
    }

    if (occupiedPosition1.endDate != occupiedPosition2.endDate) {
        match = false;
        message += 'End Dates do not match. ' + occupiedPosition1.endDate +' != ' + occupiedPosition2.endDate + '\n';
    }

	if (occupiedPosition1.governmentRoles != null && occupiedPosition2.governmentRoles != null) {
		if (occupiedPosition1.governmentRoles.length != occupiedPosition2.governmentRoles.length) {
			match = false;
			message += "Government Roles do not match. \n";
		}
		else {
			for (var i = 0; i < occupiedPosition1.governmentRoles.length; i++) {
				if (occupiedPosition1.governmentRoles[i] != occupiedPosition2.governmentRoles[i]) {
					match = false;
					message += "Government Roles do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Occupied Positions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		OccupiedPosition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = OccupiedPosition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


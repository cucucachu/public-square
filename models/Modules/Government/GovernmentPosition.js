/* 
 Mongoose Schema and Model Functions
 Model: Government Position
 Description: Defines a Postion in a particular Government Institution. For a Government Institution for a City Council, there may be positions
    for Board Chair, Board Member, Treasurer, etc. If there are multiple positions with the same title, the max attribute defines the maximum 
    number of positions that can be filled at any time. For example if a City Council has 5 Board Members, there would be one position
    called 'Board Member', and max for this position would be 5.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GovernemntInstitution = require('./GovernmentInstitution');
var EffectivePositionDefinition = require('./EffectivePositionDefinition');

// Schema and Model Setup
var GovernmentPositionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    max: {
        type: Number
    },
    governmentInstitution: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentInstitution',
        required: true
    },
    effectivePositionDefinitions: {
        type: [Schema.Types.ObjectId],
        ref: 'EffectivePositionDefinition'
    }
});

var GovernmentPosition = mongoose.model('GovernmentPosition', GovernmentPositionSchema);

//Methods 

// Create Method
var create = function() {
	return new GovernmentPosition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(governmentPosition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		governmentPosition.save(function(err, saved) {
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
var compare = function(governmentPosition1, governmentPosition2) {
    var match = true;
    var message = '';

    if (governmentPosition1.governmentInstitution != governmentPosition2.governmentInstitution) {
        match = false;
        message += 'Government Institutions do not match. ' + governmentPosition1.governmentInstitution +' != ' + governmentPosition2.governmentInstitution + '\n';
    }

    if (governmentPosition1.title != governmentPosition2.title) {
        match = false;
        message += 'Titles do not match. ' + governmentPosition1.title +' != ' + governmentPosition2.title + '\n';
    }

    if (governmentPosition1.description != governmentPosition2.description) {
        match = false;
        message += 'Descriptions do not match. ' + governmentPosition1.description +' != ' + governmentPosition2.description + '\n';
    }

	if (governmentPosition1.effectivePositionDefinitions != null && governmentPosition2.effectivePositionDefinitions != null) {
		if (governmentPosition1.effectivePositionDefinitions.length != governmentPosition2.effectivePositionDefinitions.length) {
			match = false;
			message += "Effective Position Definitions do not match. \n";
		}
		else {
			for (var i = 0; i < governmentPosition1.effectivePositionDefinitions.length; i++) {
				if (governmentPosition1.effectivePositionDefinitions[i] != governmentPosition2.effectivePositionDefinitions[i]) {
					match = false;
					message += "Effective Position Definitions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Government Positions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GovernmentPosition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GovernmentPosition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


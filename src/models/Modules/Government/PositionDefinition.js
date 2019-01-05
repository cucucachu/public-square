/* 
 Mongoose Schema and Model Functions
 Model: Position Definition
 Description: Defines complex properties for positions. This is separated out into its own class and model so that these definitions can be reused
    for multiple positions accross different governments and at different times. These properties include data about Terms, the Powers available
    to the holder of the position, and how the position is filled (Hiring Process). A definition for the President of the United States position
	would define what a term is (4 years), the term limits (2 terms), the powers available (executive, military), and the aquisition process 
	definition (election through electory college).
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var EffectivePositionDefinition = require('./EffectivePositionDefinition');
var TermDefinition = require('./TermDefinition');
var GovernmentPower = require('./GovernmentPower');
var AcquisitionProcessDefinition = require('./AcquisitionProcessDefinition');

// Schema and Model Setup
var PositionDefinitionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    effectivePositionDefinitions: {
        type: [Schema.Types.ObjectId],
        ref: 'EffectivePositionDefinition'
    },
    termDefinition: {
        type: Schema.Types.ObjectId,
        ref: 'TermDefinition',
    },
    governmentPowers: {
        type: [Schema.Types.ObjectId],
        ref: 'GovernmentPower'
    },
    acquisitionProcessDefinitions: {
        type: [Schema.Types.ObjectId],
        ref: 'AcquisitionProcessDefinition'
    }
});

var PositionDefinition = mongoose.model('PositionDefinition', PositionDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new PositionDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(positionDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		positionDefinition.save(function(err, saved) {
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
var compare = function(positionDefinition1, positionDefinition2) {
    var match = true;
    var message = '';

    if (positionDefinition1.name != positionDefinition2.name) {
        match = false;
        message += 'Names do not match. ' + positionDefinition1.name +' != ' + positionDefinition2.name + '\n';
    }

    if (positionDefinition1.termDefinition != positionDefinition2.termDefinition) {
        match = false;
        message += 'Term Definitions do not match. ' + positionDefinition1.termDefinition +' != ' + positionDefinition2.termDefinition + '\n';
    }

	if (positionDefinition1.effectivePositionDefinitions != null && positionDefinition2.effectivePositionDefinitions != null) {
		if (positionDefinition1.effectivePositionDefinitions.length != positionDefinition2.effectivePositionDefinitions.length) {
			match = false;
			message += "Effective Position Definitions do not match. \n";
		}
		else {
			for (var i = 0; i < positionDefinition1.effectivePositionDefinitions.length; i++) {
				if (positionDefinition1.effectivePositionDefinitions[i] != positionDefinition2.effectivePositionDefinitions[i]) {
					match = false;
					message += "Effective Position Definitions do not match. \n";

				}
			}
		}
	}

	if (positionDefinition1.governmentPowers != null && positionDefinition2.governmentPowers != null) {
		if (positionDefinition1.governmentPowers.length != positionDefinition2.governmentPowers.length) {
			match = false;
			message += "Govrenment Powers do not match. \n";
		}
		else {
			for (var i = 0; i < positionDefinition1.governmentPowers.length; i++) {
				if (positionDefinition1.governmentPowers[i] != positionDefinition2.governmentPowers[i]) {
					match = false;
					message += "Government Powers Definitions do not match. \n";

				}
			}
		}
	}

	if (positionDefinition1.acquisitionProcessDefinitions != null && positionDefinition2.acquisitionProcessDefinitions != null) {
		if (positionDefinition1.acquisitionProcessDefinitions.length != positionDefinition2.acquisitionProcessDefinitions.length) {
			match = false;
			message += "Acquisition Process Definitions do not match. \n";
		}
		else {
			for (var i = 0; i < positionDefinition1.acquisitionProcessDefinitions.length; i++) {
				if (positionDefinition1.acquisitionProcessDefinitions[i] != positionDefinition2.acquisitionProcessDefinitions[i]) {
					match = false;
					message += "Acquisition Process Definitions do not match. \n";

				}
			}
		}
	}



	if (match)
		message = 'Position Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		PositionDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PositionDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


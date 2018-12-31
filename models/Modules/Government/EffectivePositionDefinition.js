/* 
 Mongoose Schema and Model Functions
 Model: Effective Position Definition
 Description: Joiner class between Government Position and Position Definition. Relates a Government Position to a Position Definition for a given date range.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GovernemntPosition = require('./GovernmentPosition');
var PositionDefinition = require('./PositionDefinition');

// Schema and Model Setup
var EffectivePositionDefinitionSchema = new Schema({
    governmentPosition: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentPosition',
        required: true
    },
    positionDefinition: {
        type: Schema.Types.ObjectId,
        ref: 'PositionDefinition',
        required: true
    }, 
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date
    }
});

var EffectivePositionDefinition = mongoose.model('EffectivePositionDefinition', EffectivePositionDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new EffectivePositionDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(effectivePositionDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		effectivePositionDefinition.save(function(err, saved) {
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
var compare = function(effectivePositionDefinition1, effectivePositionDefinition2) {
    var match = true;
    var message = '';

    if (effectivePositionDefinition1.governmentPosition != effectivePositionDefinition2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + effectivePositionDefinition1.governmentPosition +' != ' + effectivePositionDefinition2.governmentPosition + '\n';
    }

    if (effectivePositionDefinition1.positionDefinition != effectivePositionDefinition2.positionDefinition) {
        match = false;
        message += 'Position Definitions do not match. ' + effectivePositionDefinition1.positionDefinition +' != ' + effectivePositionDefinition2.positionDefinition + '\n';
    }

    if (effectivePositionDefinition1.startDate != effectivePositionDefinition2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + effectivePositionDefinition1.startDate +' != ' + effectivePositionDefinition2.startDate + '\n';
    }

    if (effectivePositionDefinition1.endDate != effectivePositionDefinition2.endDate) {
        match = false;
        message += 'End Dates do not match. ' + effectivePositionDefinition1.endDate +' != ' + effectivePositionDefinition2.endDate + '\n';
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
		EffectivePositionDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = EffectivePositionDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


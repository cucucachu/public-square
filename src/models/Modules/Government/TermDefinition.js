/* 
 Mongoose Schema and Model Functions
 Model: Term Definition
 Description: Defines the lenght (in time) and the term limit (max number of terms) for a Position Definition. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var PositionDefinition = require('./PositionDefinition');

// Schema and Model Setup
var TermDefinitionSchema = new Schema({
    termLength: {
        type: Number,
        required: true
    },
    termLimit: {
        type: Number,
        required: true
    },
    positionDefinition: {
        type: Schema.Types.ObjectId,
        ref: 'PositionDefinition'
    }
});

var TermDefinition = mongoose.model('TermDefinition', TermDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new TermDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(termDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		termDefinition.save(function(err, saved) {
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
var compare = function(termDefinition1, termDefinition2) {
    var match = true;
    var message = '';

    if (termDefinition1.termLength != termDefinition2.termLength) {
        match = false;
        message += 'Term Lengths do not match. ' + termDefinition1.termLength +' != ' + termDefinition2.termLength + '\n';
    }

    if (termDefinition1.termLimit != termDefinition2.termLimit) {
        match = false;
        message += 'Term Limits do not match. ' + termDefinition1.termLimit +' != ' + termDefinition2.termLimit + '\n';
    }

    if (termDefinition1.positionDefinition != termDefinition2.positionDefinition) {
        match = false;
        message += 'Position Definitions do not match. ' + termDefinition1.positionDefinition +' != ' + termDefinition2.positionDefinition + '\n';
    }

	if (match)
		message = 'Term Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		TermDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = TermDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


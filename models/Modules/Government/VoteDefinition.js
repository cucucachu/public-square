/* 
 Mongoose Schema and Model Functions
 Model: Vote Definition
 Description: Represents a possible vote. Because voting can be more than a simple 'Yay' or 'Nay', this class captures all the posible properties 
 of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes cast, etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var VoteDefinitionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    positive: {
        type: Boolean
    },
    negative: {
        type: Boolean
    },
    countsTowardsTotal: {
        type: Boolean
    }
});

var VoteDefinition = mongoose.model('VoteDefinition', VoteDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new VoteDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(voteDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		voteDefinition.save(function(err, saved) {
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
var compare = function(voteDefinition1, voteDefinition2) {
    var match = true;
    var message = '';

    if (voteDefinition1.name != voteDefinition2.name) {
        match = false;
        message += 'Names do not match. ' + voteDefinition1.name +' != ' + voteDefinition2.name + '\n';
    }

    if (voteDefinition1.positive != voteDefinition2.positive) {
        match = false;
        message += 'Positives do not match. ' + voteDefinition1.positive +' != ' + voteDefinition2.positive + '\n';
    }

    if (voteDefinition1.negative != voteDefinition2.negative) {
        match = false;
        message += 'Negatives do not match. ' + voteDefinition1.negative +' != ' + voteDefinition2.negative + '\n';
    }

    if (voteDefinition1.countsTowardsTotal != voteDefinition2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + voteDefinition1.countsTowardsTotal +' != ' + voteDefinition2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Vote Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		VoteDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = VoteDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


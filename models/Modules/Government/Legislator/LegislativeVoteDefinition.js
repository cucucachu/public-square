/* 
 Mongoose Schema and Model Functions
 Model: Legislative Vote Definition
 Super Class: Vote Definition
 Description: Represents a possible vote for a Bill (or something else a legislature could vote on). Because voting can be more than a simple
    'Yay' or 'Nay', this class captures all the posible properties of a vote, such as, does the vote count as positive or negative, does it count
    toward the total number of votes cast, etc.

 1 Way Relationships Targeting this Class: Individual Legislative Vote has one Legislative Vote Definition
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var IndividualLegislativeVote = require('./IndividualLegislativeVote');
var VoteDefinition = require('../VoteDefinition');

// Schema and Model Setup
var LegislativeVoteDefinitionSchema = new Schema({
});

var LegislativeVoteDefinition = VoteDefinition.Model.discriminator('LegislativeVoteDefinition', LegislativeVoteDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new LegislativeVoteDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(legislativeVoteDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		legislativeVoteDefinition.save(function(err, saved) {
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
var compare = function(legislativeVoteDefinition1, legislativeVoteDefinition2) {
    var match = true;
    var message = '';

    if (legislativeVoteDefinition1.positive != legislativeVoteDefinition2.positive) {
        match = false;
        message += 'Positives do not match. ' + legislativeVoteDefinition1.positive +' != ' + legislativeVoteDefinition2.positive + '\n';
    }

    if (legislativeVoteDefinition1.negative != legislativeVoteDefinition2.negative) {
        match = false;
        message += 'Negatives do not match. ' + legislativeVoteDefinition1.negative +' != ' + legislativeVoteDefinition2.negative + '\n';
    }

    if (legislativeVoteDefinition1.countsTowardsTotal != legislativeVoteDefinition2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + legislativeVoteDefinition1.countsTowardsTotal +' != ' + legislativeVoteDefinition2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Legislative Vote Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		LegislativeVoteDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = LegislativeVoteDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


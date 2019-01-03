/* 
 Mongoose Schema and Model Functions
 Model: Confirmation Vote Definition
 Super Class: Vote Definition
 Description: Represents a possible vote for a Nomination (or something else a legislature could vote on). Because voting can be more than a simple
    'Yay' or 'Nay', this class captures all the posible properties of a vote, such as, does the vote count as positive or negative, does it count
    toward the total number of votes cast, etc.

 1 Way Relationships Targeting this Class: Individual Confirmation Vote has one Confirmation Vote Definition
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualConfirmationVote = require('./IndividualConfirmationVote');
var VoteDefinition = require('../VoteDefinition');

// Schema and Model Setup
var ConfirmationVoteDefinitionSchema = new Schema({
});

var ConfirmationVoteDefinition = VoteDefinition.Model.discriminator('ConfirmationVoteDefinition', ConfirmationVoteDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new ConfirmationVoteDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(confirmationVoteDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		confirmationVoteDefinition.save(function(err, saved) {
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
var compare = function(confirmationVoteDefinition1, confirmationVoteDefinition2) {
    var match = true;
    var message = '';

    if (confirmationVoteDefinition1.name != confirmationVoteDefinition2.name) {
        match = false;
        message += 'Names do not match. ' + confirmationVoteDefinition1.name +' != ' + confirmationVoteDefinition2.name + '\n';
    }

    if (confirmationVoteDefinition1.positive != confirmationVoteDefinition2.positive) {
        match = false;
        message += 'Positives do not match. ' + confirmationVoteDefinition1.positive +' != ' + confirmationVoteDefinition2.positive + '\n';
    }

    if (confirmationVoteDefinition1.negative != confirmationVoteDefinition2.negative) {
        match = false;
        message += 'Negatives do not match. ' + confirmationVoteDefinition1.negative +' != ' + confirmationVoteDefinition2.negative + '\n';
    }

    if (confirmationVoteDefinition1.countsTowardsTotal != confirmationVoteDefinition2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + confirmationVoteDefinition1.countsTowardsTotal +' != ' + confirmationVoteDefinition2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Confirmation Vote Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ConfirmationVoteDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ConfirmationVoteDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


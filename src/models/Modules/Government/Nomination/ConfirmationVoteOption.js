/* 
 Mongoose Schema and Model Functions
 Model: Confirmation Vote Option
 Super Class: Vote Option
 Description: Represents a possible vote for a Nomination (or something else a legislature could vote on). Because voting can be more than a simple
    'Yay' or 'Nay', this class captures all the posible properties of a vote, such as, does the vote count as positive or negative, does it count
    toward the total number of votes cast, etc.

 1 Way Relationships Targeting this Class: Individual Confirmation Vote has one Confirmation Vote Option
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var VoteOption = require('../VoteOption');

// Schema and Model Setup
var ConfirmationVoteOptionSchema = new Schema({
});

var ConfirmationVoteOption = VoteOption.Model.discriminator('ConfirmationVoteOption', ConfirmationVoteOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new ConfirmationVoteOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(confirmationVoteOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		confirmationVoteOption.save(function(err, saved) {
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
var compare = function(confirmationVoteOption1, confirmationVoteOption2) {
    var match = true;
    var message = '';

    if (confirmationVoteOption1.name != confirmationVoteOption2.name) {
        match = false;
        message += 'Names do not match. ' + confirmationVoteOption1.name +' != ' + confirmationVoteOption2.name + '\n';
    }

    if (confirmationVoteOption1.positive != confirmationVoteOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + confirmationVoteOption1.positive +' != ' + confirmationVoteOption2.positive + '\n';
    }

    if (confirmationVoteOption1.negative != confirmationVoteOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + confirmationVoteOption1.negative +' != ' + confirmationVoteOption2.negative + '\n';
    }

    if (confirmationVoteOption1.countsTowardsTotal != confirmationVoteOption2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + confirmationVoteOption1.countsTowardsTotal +' != ' + confirmationVoteOption2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Confirmation Vote Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ConfirmationVoteOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ConfirmationVoteOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


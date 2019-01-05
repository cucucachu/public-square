/* 
 Mongoose Schema and Model Functions
 Model: Legislative Vote Option
 Super Class: Vote Option
 Description: Represents a possible vote for a Bill (or something else a legislature could vote on). Because voting can be more than a simple
    'Yay' or 'Nay', this class captures all the posible properties of a vote, such as, does the vote count as positive or negative, does it count
    toward the total number of votes cast, etc.

 1 Way Relationships Targeting this Class: Individual Legislative Vote has one Legislative Vote Option
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var VoteOption = require('../VoteOption');

// Schema and Model Setup
var LegislativeVoteOptionSchema = new Schema({
});

var LegislativeVoteOption = VoteOption.Model.discriminator('LegislativeVoteOption', LegislativeVoteOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new LegislativeVoteOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(legislativeVoteOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		legislativeVoteOption.save(function(err, saved) {
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
var compare = function(legislativeVoteOption1, legislativeVoteOption2) {
    var match = true;
    var message = '';

    if (legislativeVoteOption1.name != legislativeVoteOption2.name) {
        match = false;
        message += 'Names do not match. ' + legislativeVoteOption1.name +' != ' + legislativeVoteOption2.name + '\n';
    }

    if (legislativeVoteOption1.positive != legislativeVoteOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + legislativeVoteOption1.positive +' != ' + legislativeVoteOption2.positive + '\n';
    }

    if (legislativeVoteOption1.negative != legislativeVoteOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + legislativeVoteOption1.negative +' != ' + legislativeVoteOption2.negative + '\n';
    }

    if (legislativeVoteOption1.countsTowardsTotal != legislativeVoteOption2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + legislativeVoteOption1.countsTowardsTotal +' != ' + legislativeVoteOption2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Legislative Vote Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		LegislativeVoteOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = LegislativeVoteOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


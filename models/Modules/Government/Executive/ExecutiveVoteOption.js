/* 
 Mongoose Schema and Model Functions
 Model: Executive Vote Option
 Super Class: Vote Definition
 Description: Represents a possible vote for a Executive Action. Because voting can be more than a simple 'Yay' or 'Nay', this class captures 
    all the posible properties of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes
    cast, etc.

 1 Way Relationships Targeting this Class: Individual Executive Vote has one Executive Vote Option
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualExecutiveVote = require('./IndividualExecutiveVote');
var VoteOption = require('../VoteOption');

// Schema and Model Setup
var ExecutiveVoteOptionSchema = new Schema({
});

var ExecutiveVoteOption = VoteOption.Model.discriminator('ExecutiveVoteOption', ExecutiveVoteOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new ExecutiveVoteOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(executiveVoteOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		executiveVoteOption.save(function(err, saved) {
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
var compare = function(executiveVoteOption1, executiveVoteOption2) {
    var match = true;
    var message = '';

    if (executiveVoteOption1.name != executiveVoteOption2.name) {
        match = false;
        message += 'Names do not match. ' + executiveVoteOption1.name +' != ' + executiveVoteOption2.name + '\n';
    }

    if (executiveVoteOption1.positive != executiveVoteOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + executiveVoteOption1.positive +' != ' + executiveVoteOption2.positive + '\n';
    }

    if (executiveVoteOption1.negative != executiveVoteOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + executiveVoteOption1.negative +' != ' + executiveVoteOption2.negative + '\n';
    }

    if (executiveVoteOption1.countsTowardsTotal != executiveVoteOption2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + executiveVoteOption1.countsTowardsTotal +' != ' + executiveVoteOption2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Executive Vote Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ExecutiveVoteOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ExecutiveVoteOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


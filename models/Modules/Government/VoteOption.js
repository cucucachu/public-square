/* 
 Mongoose Schema and Model Functions
 Model: Vote Option
 Description: Represents a possible vote. Because voting can be more than a simple 'Yay' or 'Nay', this class captures all the posible properties 
    of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes cast, etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var VoteOptionSchema = new Schema({
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

var VoteOption = mongoose.model('VoteOption', VoteOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new VoteOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(voteOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		voteOption.save(function(err, saved) {
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
var compare = function(voteOption1, voteOption2) {
    var match = true;
    var message = '';

    if (voteOption1.name != voteOption2.name) {
        match = false;
        message += 'Names do not match. ' + voteOption1.name +' != ' + voteOption2.name + '\n';
    }

    if (voteOption1.positive != voteOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + voteOption1.positive +' != ' + voteOption2.positive + '\n';
    }

    if (voteOption1.negative != voteOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + voteOption1.negative +' != ' + voteOption2.negative + '\n';
    }

    if (voteOption1.countsTowardsTotal != voteOption2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + voteOption1.countsTowardsTotal +' != ' + voteOption2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Vote Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		VoteOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = VoteOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


/* 
 Mongoose Schema and Model Functions
 Model: Individual Executive Vote
 Description: Represents a Executive's vote on a particular Executive Actiong. Has a relationship to the Executive who made the decision, the 
    Executive Vote (group) and the Executive Vote Option chosen. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var Executive = require('./Executive');
var ExecutiveVote = require('./ExecutiveVote');
var ExecutiveVoteOption = require('./ExecutiveVoteOption');

// Schema and Model Setup
var IndividualExecutiveVoteSchema = new Schema({
    executive: {
        type: Schema.Types.ObjectId,
        ref: 'Executive',
        required: true
    },
    executiveVote: {
        type: Schema.Types.ObjectId,
        ref: 'ExecutiveVote',
        required: true
    },
    executiveVoteOption: {
        type: Schema.Types.ObjectId,
        ref: 'ExecutiveVoteOption',
        required: true
    }
});

var IndividualExecutiveVote = mongoose.model('IndividualExecutiveVote', IndividualExecutiveVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new IndividualExecutiveVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(individualExecutiveVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		individualExecutiveVote.save(function(err, saved) {
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
var compare = function(individualExecutiveVote1, individualExecutiveVote2) {
    var match = true;
    var message = '';

    if (individualExecutiveVote1.executive != individualExecutiveVote2.executive) {
        match = false;
        message += 'Executives do not match. ' + individualExecutiveVote1.executive +' != ' + individualExecutiveVote2.executive + '\n';
    }

    if (individualExecutiveVote1.executiveVote != individualExecutiveVote2.executiveVote) {
        match = false;
        message += 'ExecutiveVotes do not match. ' + individualExecutiveVote1.executiveVote +' != ' + individualExecutiveVote2.executiveVote + '\n';
    }

    if (individualExecutiveVote1.executiveVoteOption != individualExecutiveVote2.executiveVoteOption) {
        match = false;
        message += 'Executive Vote Options do not match. ' + individualExecutiveVote1.executiveVoteOption +' != ' + individualExecutiveVote2.executiveVoteOption + '\n';
    }

	if (match)
		message = 'Individual Executive Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		IndividualExecutiveVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = IndividualExecutiveVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


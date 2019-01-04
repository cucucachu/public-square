/* 
 Mongoose Schema and Model Functions
 Model: Executive Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Group Executive Action. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualExecutiveVote = require('./IndividualExecutiveVote');
var GroupExecutiveAction = require('./GroupExecutiveAction');

// Schema and Model Setup
var ExecutiveVoteSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    groupExecutiveAction: {
        type: Schema.Types.ObjectId,
        ref: 'GroupExecutiveAction',
        required: true
    },
    individualExecutiveVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualExecutiveVote'
    }
});

var ExecutiveVote = mongoose.model('ExecutiveVote', ExecutiveVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new ExecutiveVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(executiveVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		executiveVote.save(function(err, saved) {
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
var compare = function(executiveVote1, executiveVote2) {
    var match = true;
    var message = '';

    if (executiveVote1.date != executiveVote2.date) {
        match = false;
        message += 'Dates do not match. ' + executiveVote1.date +' != ' + executiveVote2.date + '\n';
    }

    if (executiveVote1.groupExecutiveAction != executiveVote2.groupExecutiveAction) {
        match = false;
        message += 'Group Executive Actions do not match. ' + executiveVote1.groupExecutiveAction +' != ' + executiveVote2.groupExecutiveAction + '\n';
    }

	if (executiveVote1.individualExecutiveVotes != null && executiveVote2.individualExecutiveVotes != null) {
		if (executiveVote1.individualExecutiveVotes.length != executiveVote2.individualExecutiveVotes.length) {
			match = false;
			message += "Individual Executive Votes do not match. \n";
		}
		else {
			for (var i = 0; i < executiveVote1.individualExecutiveVotes.length; i++) {
				if (executiveVote1.individualExecutiveVotes[i] != executiveVote2.individualExecutiveVotes[i]) {
					match = false;
					message += "Individual Executive Votes do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Executive Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ExecutiveVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ExecutiveVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


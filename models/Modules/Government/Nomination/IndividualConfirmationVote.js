/* 
 Mongoose Schema and Model Functions
 Model: Individual Confirmation Vote
 Description: Represents a Confirmers's vote for a particular Nomination. Has a relationship to the Confirmer who casted the vote, the Confirmation 
    Vote (the class that groups the votes), and the Confirmation Vote Option. The Confirmation Vote Option can be thought of as the actual
    'Yay' or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var IndividualConfirmationVoteSchema = new Schema({
    confirmer: {
        type: Schema.Types.ObjectId,
        ref: 'Confirmer',
        required: true
    },
    confirmationVote: {
        type: Schema.Types.ObjectId,
        ref: 'ConfirmationVote',
        required: true
    },
    confirmationVoteOption: {
        type: Schema.Types.ObjectId,
        ref: 'ConfirmationVoteOption',
        required: true
    }
});

var IndividualConfirmationVote = mongoose.model('IndividualConfirmationVote', IndividualConfirmationVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new IndividualConfirmationVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(individualConfirmationVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		individualConfirmationVote.save(function(err, saved) {
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
var compare = function(individualConfirmationVote1, individualConfirmationVote2) {
    var match = true;
    var message = '';

    if (individualConfirmationVote1.confirmer != individualConfirmationVote2.confirmer) {
        match = false;
        message += 'Confirmers do not match. ' + individualConfirmationVote1.confirmer +' != ' + individualConfirmationVote2.confirmer + '\n';
    }

    if (individualConfirmationVote1.confirmationVote != individualConfirmationVote2.confirmationVote) {
        match = false;
        message += 'Confirmation Votes do not match. ' + individualConfirmationVote1.confirmationVote +' != ' + individualConfirmationVote2.confirmationVote + '\n';
    }

    if (individualConfirmationVote1.confirmationVoteOption != individualConfirmationVote2.confirmationVoteOption) {
        match = false;
        message += 'Confirmation Vote Options do not match. ' + individualConfirmationVote1.confirmationVoteOption +' != ' + individualConfirmationVote2.confirmationVoteOption + '\n';
    }

	if (match)
		message = 'Individual Confirmation Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		IndividualConfirmationVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = IndividualConfirmationVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


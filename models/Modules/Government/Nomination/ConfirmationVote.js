/* 
 Mongoose Schema and Model Functions
 Model: Confirmation Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Nomination. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualConfirmationVote = require('./IndividualConfirmationVote');
var Nomination = require('./Nomination');

// Schema and Model Setup
var ConfirmationVoteSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    nomination: {
        type: Schema.Types.ObjectId,
        ref: 'Nomination',
        required: true
    },
    individualConfirmationVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualConfirmationVote'
    }
});

var ConfirmationVote = mongoose.model('ConfirmationVote', ConfirmationVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new ConfirmationVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(confirmationVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		confirmationVote.save(function(err, saved) {
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
var compare = function(confirmationVote1, confirmationVote2) {
    var match = true;
    var message = '';

    if (confirmationVote1.date != confirmationVote2.date) {
        match = false;
        message += 'Dates do not match. ' + confirmationVote1.date +' != ' + confirmationVote2.date + '\n';
    }

    if (confirmationVote1.nomination != confirmationVote2.nomination) {
        match = false;
        message += 'Nominations do not match. ' + confirmationVote1.nomination +' != ' + confirmationVote2.nomination + '\n';
    }

	if (confirmationVote1.individualConfirmationVotes != null && confirmationVote2.individualConfirmationVotes != null) {
		if (confirmationVote1.individualConfirmationVotes.length != confirmationVote2.individualConfirmationVotes.length) {
			match = false;
			message += "Individual Confirmation Votes do not match. \n";
		}
		else {
			for (var i = 0; i < confirmationVote1.individualConfirmationVotes.length; i++) {
				if (confirmationVote1.individualConfirmationVotes[i] != confirmationVote2.individualConfirmationVotes[i]) {
					match = false;
					message += "Individual Confirmation Votes do not match. \n";

				}
			}
		}
	}


	if (match)
		message = 'Confirmation Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ConfirmationVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ConfirmationVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


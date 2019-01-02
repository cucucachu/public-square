/* 
 Mongoose Schema and Model Functions
 Model: Individual Legislative Vote
 Description: Represents a Legislator's vote for a particular Bill. Has a relationship to the Legislator who casted the vote, the Legislate Vote
    (the class that groups the votes), and the Legislative Vote Definition. The Legislative Vote Definition can be thought of as the actual 'Yay'
    or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var Legislator = require('./Legislator');
var LegislativeVote = require('./LegislativeVote');
var LegislativeVoteDefinition = require('./LegislativeVoteDefinition');

// Schema and Model Setup
var IndividualLegislativeVoteSchema = new Schema({
    legislator: {
        type: Schema.Types.ObjectId,
        ref: 'Legislator',
        required: true
    },
    legislativeVote: {
        type: Schema.Types.ObjectId,
        ref: 'LegislativeVote',
        required: true
    },
    legislativeVoteDefinition: {
        type: Schema.Types.ObjectId,
        ref: 'LegislativeVoteDefinition',
        required: true
    }
});

var IndividualLegislativeVote = mongoose.model('IndividualLegislativeVote', IndividualLegislativeVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new IndividualLegislativeVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(individualLegislativeVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		individualLegislativeVote.save(function(err, saved) {
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
var compare = function(individualLegislativeVote1, individualLegislativeVote2) {
    var match = true;
    var message = '';

    if (individualLegislativeVote1.legislator != individualLegislativeVote2.legislator) {
        match = false;
        message += 'Legislators do not match. ' + individualLegislativeVote1.legislator +' != ' + individualLegislativeVote2.legislator + '\n';
    }

    if (individualLegislativeVote1.legislativeVote != individualLegislativeVote2.legislativeVote) {
        match = false;
        message += 'Legislative Votes do not match. ' + individualLegislativeVote1.legislativeVote +' != ' + individualLegislativeVote2.legislativeVote + '\n';
    }

    if (individualLegislativeVote1.legislativeVoteDefinition != individualLegislativeVote2.legislativeVoteDefinition) {
        match = false;
        message += 'Legislative Vote Definitons do not match. ' + individualLegislativeVote1.legislativeVoteDefinition +' != ' + individualLegislativeVote2.legislativeVoteDefinition + '\n';
    }

	if (match)
		message = 'Individual Legislative Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		IndividualLegislativeVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = IndividualLegislativeVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


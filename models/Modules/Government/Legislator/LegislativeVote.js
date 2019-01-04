/* 
 Mongoose Schema and Model Functions
 Model: Legislative Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Bill. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualLegislativeVote = require('./IndividualLegislativeVote');
var BillVersion = require('./BillVersion');

// Schema and Model Setup
var LegislativeVoteSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    billVersion: {
        type: Schema.Types.ObjectId,
        ref: 'BillVersion',
        required: true
    },
    individualLegislativeVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualLegislativeVote'
    }
});

var LegislativeVote = mongoose.model('LegislativeVote', LegislativeVoteSchema);

//Methods 

// Create Method
var create = function() {
	return new LegislativeVote({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(legislativeVote, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		legislativeVote.save(function(err, saved) {
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
var compare = function(legislativeVote1, legislativeVote2) {
    var match = true;
    var message = '';

    if (legislativeVote1.date != legislativeVote2.date) {
        match = false;
        message += 'Dates do not match. ' + legislativeVote1.date +' != ' + legislativeVote2.date + '\n';
    }

    if (legislativeVote1.billVersion != legislativeVote2.billVersion) {
        match = false;
        message += 'Bill Versions do not match. ' + legislativeVote1.billVersion +' != ' + legislativeVote2.billVersion + '\n';
    }

	if (legislativeVote1.individualLegislativeVotes != null && legislativeVote2.individualLegislativeVotes != null) {
		if (legislativeVote1.individualLegislativeVotes.length != legislativeVote2.individualLegislativeVotes.length) {
			match = false;
			message += "Individual Legislative Votes do not match. \n";
		}
		else {
			for (var i = 0; i < legislativeVote1.individualLegislativeVotes.length; i++) {
				if (legislativeVote1.individualLegislativeVotes[i] != legislativeVote2.individualLegislativeVotes[i]) {
					match = false;
					message += "Individual Legislative Votes do not match. \n";

				}
			}
		}
	}


	if (match)
		message = 'Legislative Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		LegislativeVote.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = LegislativeVote;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


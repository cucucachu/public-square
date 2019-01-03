/* 
 Mongoose Schema and Model Functions
 Model: Election Result
 Sub Classes: Primary Election Result
 Description: Holds the vote counts for an election, for a particular Geographic Area and Campaign. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GeographicArea = require('../../Geography/GeographicArea');
var Campaign = require('./Campaign');

// Schema and Model Setup
var ElectionResultSchema = new Schema({
    citizenVotes: {
        type: Number
    },
    representitiveVotes: {
        type: Number
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    geographicArea: {
        type: Schema.Types.ObjectId,
        ref: 'GeographicArea',
        required: true
    }
});

var ElectionResult = mongoose.model('ElectionResult', ElectionResultSchema);

//Methods 

// Create Method
var create = function() {
	return new ElectionResult({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(electionResult, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		electionResult.save(function(err, saved) {
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
var compare = function(electionResult1, electionResult2) {
    var match = true;
    var message = '';

    if (electionResult1.citizenVotes != electionResult2.citizenVotes) {
        match = false;
        message += 'Citizen Votes do not match. ' + electionResult1.citizenVotes +' != ' + electionResult2.citizenVotes + '\n';
    }

    if (electionResult1.representitiveVotes != electionResult2.representitiveVotes) {
        match = false;
        message += 'Representative Votes do not match. ' + electionResult1.representitiveVotes +' != ' + electionResult2.representitiveVotes + '\n';
    }

    if (electionResult1.geographicArea != electionResult2.geographicArea) {
        match = false;
        message += 'Geographic Areas do not match. ' + electionResult1.geographicArea +' != ' + electionResult2.geographicArea + '\n';
    }

    if (electionResult1.campaign != electionResult2.campaign) {
        match = false;
        message += 'Campaigns do not match. ' + electionResult1.campaign +' != ' + electionResult2.campaign + '\n';
    }

	if (match)
		message = 'Election Results Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ElectionResult.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ElectionResult;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


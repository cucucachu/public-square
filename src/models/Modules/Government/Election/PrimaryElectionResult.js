/* 
 Mongoose Schema and Model Functions
 Model: Primary Election Result
Super Class: Election Result
 Description: Holds the vote counts for a primary election, for a particular Geographic Area and Campaign. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var ElectionResult = require('./ElectionResult');

// Schema and Model Setup
var PrimaryElectionResultSchema = new Schema({
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

var PrimaryElectionResult = ElectionResult.Model.discriminator('PrimaryElectionResult', PrimaryElectionResultSchema);

//Methods 

// Create Method
var create = function() {
	return new PrimaryElectionResult({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(primaryElectionResult, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		primaryElectionResult.save(function(err, saved) {
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
var compare = function(primaryElectionResult1, primaryElectionResult2) {
    var match = true;
    var message = '';

    if (primaryElectionResult1.citizenVotes != primaryElectionResult2.citizenVotes) {
        match = false;
        message += 'Citizen Votes do not match. ' + primaryElectionResult1.citizenVotes +' != ' + primaryElectionResult2.citizenVotes + '\n';
    }

    if (primaryElectionResult1.representitiveVotes != primaryElectionResult2.representitiveVotes) {
        match = false;
        message += 'Representative Votes do not match. ' + primaryElectionResult1.representitiveVotes +' != ' + primaryElectionResult2.representitiveVotes + '\n';
    }

    if (primaryElectionResult1.geographicArea != primaryElectionResult2.geographicArea) {
        match = false;
        message += 'Geographic Areas do not match. ' + primaryElectionResult1.geographicArea +' != ' + primaryElectionResult2.geographicArea + '\n';
    }

    if (primaryElectionResult1.campaign != primaryElectionResult2.campaign) {
        match = false;
        message += 'Campaigns do not match. ' + primaryElectionResult1.campaign +' != ' + primaryElectionResult2.campaign + '\n';
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
		PrimaryElectionResult.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PrimaryElectionResult;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


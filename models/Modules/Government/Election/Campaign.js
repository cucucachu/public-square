/* 
 Mongoose Schema and Model Functions
 Model: Campaign
 Description: Joiner class between Government Position and Election. Relates a Election to a Position Definition for a given date range.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Candidate = require('./Candidate');
var Election = require('./Election');
var ElectionResult = require('./ElectionResult');

// Schema and Model Setup
var CampaignSchema = new Schema({
    candidate: {
    	type: Schema.Types.ObjectId,
    	ref: 'Candidate',
    	required: true
    },
    election: {
    	type: Schema.Types.ObjectId,
    	ref: 'Election',
    	required: true
	},
	electionResults: {
		type: [Schema.Types.ObjectId],
		ref: 'ElectionResult'
	}

});

var Campaign = mongoose.model('Campaign', CampaignSchema);

//Methods 

// Create Method
var create = function() {
	return new Campaign({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(campaign, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		campaign.save(function(err, saved) {
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
var compare = function(campaign1, campaign2) {
    var match = true;
    var message = '';

    if (campaign1.candidate != campaign2.candidate) {
        match = false;
        message += 'Campaign Candidates do not match. ' + campaign1.candidate +' != ' + campaign2.candidate + '\n';
    }

    if (campaign1.election != campaign2.election) {
        match = false;
        message += 'Elections do not match. ' + campaign1.election +' != ' + campaign2.election + '\n';
    }

	if (campaign1.electionResults != null && campaign2.electionResults != null) {
		if (campaign1.positionAcquisitionProcesses.length != campaign2.electionResults.length) {
			match = false;
			message += "Election Results do not match. \n";
		}
		else {
			for (var i = 0; i < campaign1.electionResults.length; i++) {
				if (campaign1.electionResults[i] != campaign2.electionResults[i]) {
					match = false;
					message += "Election Resultss do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Campaigns Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Campaign.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Campaign;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


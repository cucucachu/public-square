/* 
 Mongoose Schema and Model Functions
 Model: Effective Position Definition
 Description: Joiner class between Government Position and Position Definition. Relates a Government Position to a Position Definition for a given date range.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Candidate = require('./Candidate');
var GovernmentPosition = require('./GivernmentPosition');

// Schema and Model Setup
var CampaignSchema = new Schema({
    termStartDate: {
        type: Date,
        required: true
    },
    candidate: {
    	type: Schema.Types.ObjectId,
    	ref: 'Candidate',
    	required: true
    },
    governmentPosition: {
    	type: Schema.Types.ObjectId,
    	ref: 'GovernmentPosition',
    	required: true
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

    if (campaign1.termStartDate != campaign2.termStartDate) {
        match = false;
        message += 'Campaign Start Dates do not match. ' + campaign1.termStartDate +' != ' + campaign2.termStartDate + '\n';
    }

    if (campaign1.candidate != campaign2.candidate) {
        match = false;
        message += 'Campaign Candidates do not match. ' + campaign1.candidate +' != ' + campaign2.candidate + '\n';
    }

    if (campaign1.governmentPosition != campaign2.governmentPosition) {
        match = false;
        message += 'Campaign Government Positions do not match. ' + campaign1.governmentPosition +' != ' + campaign2.governmentPosition + '\n';
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


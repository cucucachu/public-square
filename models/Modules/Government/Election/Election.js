/* 
 Mongoose Schema and Model Functions
 Model: Election
 SuperClass: Position Acquisition Process
 Description: Represents an Election for a particular Government Position. Has relationships to all the campaigns running for that position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

// Schema and Model Setup
var ElectionSchema = new Schema({
    electionDate: {
        type: Date
    },
    termStartDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.electionDate)
                    return false;
                return true;
            },
            message: 'Term Start Date must be greater than or equal to Election Date.'
        }
    },
    campaigns: {
        type: [Schema.Types.ObjectId],
        ref: 'Campaign',
        required: true
    }
});

var Election = PositionAcquisitionProcess.Model.discriminator('Election', ElectionSchema);

//Methods 

// Create Method
var create = function() {
	return new Election({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(election, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		election.save(function(err, saved) {
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
var compare = function(election1, election2) {
    var match = true;
    var message = '';

    if (election1.governmentPosition != election2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + election1.governmentPosition +' != ' + election2.governmentPosition + '\n';
    }

    if (election1.electionDate != election2.electionDate) {
        match = false;
        message += 'Election Dates do not match. ' + election1.electionDate +' != ' + election2.electionDate + '\n';
    }

    if (election1.termStartDate != election2.termStartDate) {
        match = false;
        message += 'Term Start Dates do not match. ' + election1.termStartDate +' != ' + election2.termStartDate + '\n';
    }

	if (election1.campaigns != null && election2.campaigns != null) {
		if (election1.campaigns.length != election2.campaigns.length) {
			match = false;
			message += "Campaigns do not match. \n";
		}
		else {
			for (var i = 0; i < election1.campaigns.length; i++) {
				if (election1.campaigns[i] != election2.campaigns[i]) {
					match = false;
					message += "Campaigns do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Elections Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Election.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Election;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


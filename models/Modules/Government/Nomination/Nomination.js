/* 
 Mongoose Schema and Model Functions
 Model: Nomination
 SuperClass: Position Acquisition Process
 Description: Represents an Nomition for a particular Government Position. Has relationships to the Nominator, and the Nominees, and Confirmation
    Votes.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');
var Nominator = require('./Nominator');
var Nominee = require('./Nominee');
var ConfirmationVote = require('./ConfirmationVote');

// Schema and Model Setup
var NominationSchema = new Schema({
    nominationDate: {
        type: Date
    },
    positionStartDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.nominationDate)
                    return false;
                return true;
            },
            message: 'Position Start Date must be greater than or equal to Nomination Date.'
        }
    },
    nominator: {
        type: Schema.Types.ObjectId,
        ref: 'Nominator',
        required: true
    },
    nominee: {
        type: Schema.Types.ObjectId,
        ref: 'Nominee',
        required: true
    },
    confirmationVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'ConfirmationVote'
    }
});

var Nomination = PositionAcquisitionProcess.Model.discriminator('Nomination', NominationSchema);

//Methods 

// Create Method
var create = function() {
	return new Nomination({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(nomination, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		nomination.save(function(err, saved) {
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
var compare = function(nomination1, nomination2) {
    var match = true;
    var message = '';

    if (nomination1.nominationDate != nomination2.nominationDate) {
        match = false;
        message += 'Nomination Dates do not match. ' + nomination1.nominationDate +' != ' + nomination2.nominationDate + '\n';
    }

    if (nomination1.positionStartDate != nomination2.positionStartDate) {
        match = false;
        message += 'Position Start Dates do not match. ' + nomination1.positionStartDate +' != ' + nomination2.positionStartDate + '\n';
    }

    if (nomination1.governmentPosition != nomination2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + nomination1.governmentPosition +' != ' + nomination2.governmentPosition + '\n';
    }

    if (nomination1.nominator != nomination2.nominator) {
        match = false;
        message += 'Nominators do not match. ' + nomination1.nominator +' != ' + nomination2.nominator + '\n';
    }

    if (nomination1.nominee != nomination2.nominee) {
        match = false;
        message += 'Nominees do not match. ' + nomination1.nominee +' != ' + nomination2.nominee + '\n';
    }

	if (nomination1.confirmationVotes != null && nomination2.confirmationVotes != null) {
		if (nomination1.confirmationVotes.length != nomination2.confirmationVotes.length) {
			match = false;
			message += "Confirmation Votes do not match. \n";
		}
		else {
			for (var i = 0; i < nomination1.confirmationVotes.length; i++) {
				if (nomination1.confirmationVotes[i] != nomination2.confirmationVotes[i]) {
					match = false;
					message += "Confirmation Votes do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Nominations Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Nomination.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Nomination;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


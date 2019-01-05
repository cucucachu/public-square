/* 
 Mongoose Schema and Model Functions
 Model: Group Executive Action
 Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which requires a group vote.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var ExecutiveAction = require('./ExecutiveAction');

// Schema and Model Setup
var GroupExecutiveActionSchema = new Schema({
    executiveVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'ExecutiveVote'
    }
});

var GroupExecutiveAction = ExecutiveAction.Model.discriminator('GroupExecutiveAction', GroupExecutiveActionSchema);

//Methods 

// Create Method
var create = function() {
	return new GroupExecutiveAction({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(groupExecutiveAction, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		groupExecutiveAction.save(function(err, saved) {
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
var compare = function(groupExecutiveAction1, groupExecutiveAction2) {
    var match = true;
    var message = '';

    if (groupExecutiveAction1.name != groupExecutiveAction2.name) {
        match = false;
        message += 'Names do not match. ' + groupExecutiveAction1.name +' != ' + groupExecutiveAction2.name + '\n';
    }

    if (groupExecutiveAction1.text != groupExecutiveAction2.text) {
        match = false;
        message += 'Texts do not match. ' + groupExecutiveAction1.text +' != ' + groupExecutiveAction2.text + '\n';
    }

    if (groupExecutiveAction1.passedDate != groupExecutiveAction2.passedDate) {
        match = false;
        message += 'Passed Dates do not match. ' + groupExecutiveAction1.passedDate +' != ' + groupExecutiveAction2.passedDate + '\n';
    }

    if (groupExecutiveAction1.effectiveDate != groupExecutiveAction2.effectiveDate) {
        match = false;
        message += 'Effective Dates do not match. ' + groupExecutiveAction1.effectiveDate +' != ' + groupExecutiveAction2.effectiveDate + '\n';
    }

	if (groupExecutiveAction1.executives != null && groupExecutiveAction2.executives != null) {
		if (groupExecutiveAction1.executives.length != groupExecutiveAction2.executives.length) {
			match = false;
			message += "Executives do not match. \n";
		}
		else {
			for (var i = 0; i < groupExecutiveAction1.executives.length; i++) {
				if (groupExecutiveAction1.executives[i] != groupExecutiveAction2.executives[i]) {
					match = false;
					message += "Executives do not match. \n";

				}
			}
		}
	}

	if (groupExecutiveAction1.executiveVotes != null && groupExecutiveAction2.executiveVotes != null) {
		if (groupExecutiveAction1.executiveVotes.length != groupExecutiveAction2.executiveVotes.length) {
			match = false;
			message += "Executive Votes do not match. \n";
		}
		else {
			for (var i = 0; i < groupExecutiveAction1.executiveVotes.length; i++) {
				if (groupExecutiveAction1.executiveVotes[i] != groupExecutiveAction2.executiveVotes[i]) {
					match = false;
					message += "Executive Votes do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Group Executive Actions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GroupExecutiveAction.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GroupExecutiveAction;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


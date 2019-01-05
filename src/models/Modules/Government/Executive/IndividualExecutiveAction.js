/* 
 Mongoose Schema and Model Functions
 Model: Individual Executive Action
 Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which does not require a group vote.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var ExecutiveAction = require('./ExecutiveAction');

// Schema and Model Setup
var IndividualExecutiveActionSchema = new Schema({});

var IndividualExecutiveAction =ExecutiveAction.Model.discriminator('IndividualExecutiveAction', IndividualExecutiveActionSchema);

//Methods 

// Create Method
var create = function() {
	return new IndividualExecutiveAction({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(individualExecutiveAction, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		individualExecutiveAction.save(function(err, saved) {
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
var compare = function(individualExecutiveAction1, individualExecutiveAction2) {
    var match = true;
    var message = '';

    if (individualExecutiveAction1.name != individualExecutiveAction2.name) {
        match = false;
        message += 'Names do not match. ' + individualExecutiveAction1.name +' != ' + individualExecutiveAction2.name + '\n';
    }

    if (individualExecutiveAction1.text != individualExecutiveAction2.text) {
        match = false;
        message += 'Texts do not match. ' + individualExecutiveAction1.text +' != ' + individualExecutiveAction2.text + '\n';
    }

    if (individualExecutiveAction1.passedDate != individualExecutiveAction2.passedDate) {
        match = false;
        message += 'Passed Dates do not match. ' + individualExecutiveAction1.passedDate +' != ' + individualExecutiveAction2.passedDate + '\n';
    }

    if (individualExecutiveAction1.effectiveDate != individualExecutiveAction2.effectiveDate) {
        match = false;
        message += 'Effective Dates do not match. ' + individualExecutiveAction1.effectiveDate +' != ' + individualExecutiveAction2.effectiveDate + '\n';
    }

	if (individualExecutiveAction1.executives != null && individualExecutiveAction2.executives != null) {
		if (individualExecutiveAction1.executives.length != individualExecutiveAction2.executives.length) {
			match = false;
			message += "Executives do not match. \n";
		}
		else {
			for (var i = 0; i < individualExecutiveAction1.executives.length; i++) {
				if (individualExecutiveAction1.executives[i] != individualExecutiveAction2.executives[i]) {
					match = false;
					message += "Executives do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Individual Executive Actions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		IndividualExecutiveAction.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = IndividualExecutiveAction;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


/* 
 Mongoose Schema and Model Functions
 Model: Executive Action
 Sub Class: Individual Executive Action, Group Executive Action
 Description: An official action taken by a Government Official with executive powers. This could be a presidential executive action (individual),
    or an action by an agency of a government (like the FCC killing net neutrality rules) (group).
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var ExecutiveActionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    passedDate: {
        type: Date
    },
    effectiveDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.passedDate)
                    return false;
                return true;
            },
            message: 'Effective Date must be greater than or equal to Passed Date.'
        }
    },
    executives: {
        type: [Schema.Types.ObjectId],
        ref: 'Executive'
    }
});

var ExecutiveAction = mongoose.model('ExecutiveAction', ExecutiveActionSchema);

//Methods 

// Create Method
var create = function() {
	return new ExecutiveAction({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(executiveAction, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		executiveAction.save(function(err, saved) {
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
var compare = function(executiveAction1, executiveAction2) {
    var match = true;
    var message = '';

    if (executiveAction1.name != executiveAction2.name) {
        match = false;
        message += 'Names do not match. ' + executiveAction1.name +' != ' + executiveAction2.name + '\n';
    }

    if (executiveAction1.text != executiveAction2.text) {
        match = false;
        message += 'Texts do not match. ' + executiveAction1.text +' != ' + executiveAction2.text + '\n';
    }

    if (executiveAction1.passedDate != executiveAction2.passedDate) {
        match = false;
        message += 'Passed Dates do not match. ' + executiveAction1.passedDate +' != ' + executiveAction2.passedDate + '\n';
    }

    if (executiveAction1.effectiveDate != executiveAction2.effectiveDate) {
        match = false;
        message += 'Effective Dates do not match. ' + executiveAction1.effectiveDate +' != ' + executiveAction2.effectiveDate + '\n';
    }

	if (executiveAction1.executives != null && executiveAction2.executives != null) {
		if (executiveAction1.executives.length != executiveAction2.executives.length) {
			match = false;
			message += "Executives do not match. \n";
		}
		else {
			for (var i = 0; i < executiveAction1.executives.length; i++) {
				if (executiveAction1.executives[i] != executiveAction2.executives[i]) {
					match = false;
					message += "Executives do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Executive Actions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ExecutiveAction.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ExecutiveAction;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


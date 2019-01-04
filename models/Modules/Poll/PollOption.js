/* 
 Mongoose Schema and Model Functions
 Model: Poll Option
 Description: Represents a possible poll option to choose from. A Poll Option could be 'Agree', 'Disagree', 'Strongly Agree', etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var PollOptionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    positive: {
        type: Boolean
    },
    negative: {
        type: Boolean
    },
    weight: {
        type: Number
    }
});

var PollOption = mongoose.model('PollOption', PollOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new PollOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(pollOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		pollOption.save(function(err, saved) {
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
var compare = function(pollOption1, pollOption2) {
    var match = true;
    var message = '';

    if (pollOption1.name != pollOption2.name) {
        match = false;
        message += 'Names do not match. ' + pollOption1.name +' != ' + pollOption2.name + '\n';
    }

    if (pollOption1.positive != pollOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + pollOption1.positive +' != ' + pollOption2.positive + '\n';
    }

    if (pollOption1.negative != pollOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + pollOption1.negative +' != ' + pollOption2.negative + '\n';
    }

    if (pollOption1.weight != pollOption2.weight) {
        match = false;
        message += 'Weights do not match. ' + pollOption1.weight +' != ' + pollOption2.weight + '\n';
    }

	if (match)
		message = 'Poll Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		PollOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PollOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


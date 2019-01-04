/* 
 Mongoose Schema and Model Functions
 Model: Poll Resonse  
 Description: Represents a users response to a Poll. User picks a Poll Option. The relationship to Civilian will always be set, but the relationship
    to citizen will only be set for verified citizens/voters.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Civilian = require('./Civilian');
var Citizen = require('./Citizen');
var Poll = require('./Poll');
var PollOption = require('./PollOption');

// Schema and Model Setup
var PollResponseSchema = new Schema({
    comment: {
        type: String
    },
    latest: {
        type: Boolean
    },
    date: {
        type: Boolean,
        required: true
    },
    civilian: {
        type: Schema.Types.ObjectId,
        ref: 'Civilian',
        required: true
    },
    citizen: {
        type: Schema.Types.ObjectId,
        ref: 'Citizen'
    },
    poll: {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    pollOption: {
        type: Schema.Types.ObjectId,
        ref: 'PollOption',
        required: true
    }
});

var PollResponse = mongoose.model('PollResponse', PollResponseSchema);

//Methods 

// Create Method
var create = function() {
	return new PollResponse({
        _id: new mongoose.Types.ObjectId(),
        date: new Date()
	});
}

// Save
var save = function(pollResponse, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		pollResponse.save(function(err, saved) {
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
var compare = function(pollResponse1, pollResponse2) {
    var match = true;
    var message = '';

    if (pollResponse1.comment != pollResponse2.comment) {
        match = false;
        message += 'Comments do not match. ' + pollResponse1.comment +' != ' + pollResponse2.comment + '\n';
    }

    if (pollResponse1.date != pollResponse2.date) {
        match = false;
        message += 'Dates do not match. ' + pollResponse1.date +' != ' + pollResponse2.date + '\n';
    }

    if (pollResponse1.latest != pollResponse2.latest) {
        match = false;
        message += 'Civilians do not match. ' + pollResponse1.latest +' != ' + pollResponse2.latest + '\n';
    }

    if (pollResponse1.civilian != pollResponse2.civilian) {
        match = false;
        message += 'Civilians do not match. ' + pollResponse1.civilian +' != ' + pollResponse2.civilian + '\n';
    }

    if (pollResponse1.citizen != pollResponse2.citizen) {
        match = false;
        message += 'Citizens do not match. ' + pollResponse1.citizen +' != ' + pollResponse2.citizen + '\n';
    }

    if (pollResponse1.poll != pollResponse2.poll) {
        match = false;
        message += 'Polls do not match. ' + pollResponse1.poll +' != ' + pollResponse2.poll + '\n';
    }

    if (pollResponse1.pollOption != pollResponse2.pollOption) {
        match = false;
        message += 'Poll Options do not match. ' + pollResponse1.pollOption +' != ' + pollResponse2.pollOption + '\n';
    }

	if (match)
		message = 'Poll Responses Votes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		PollResponse.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PollResponse;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;



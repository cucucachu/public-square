/* 
 Mongoose Schema and Model Functions
 Model: Poll
 Description: A joiner class between a pollable object and polling data. Has a relationship to individual Poll Responses and available Polling
    Options.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database').database;
var Schema = mongoose.Schema;

// Validation Methods


// Returns false if more than one of the Pollable relationships is set.
var pollableMutuallyExclusive = function() {
    var numberOfPollables = 0;

    if (this.government) 
        numberOfPollables++;

    if (this.governmentInstitution) 
        numberOfPollables++;

    if (this.occupiedPosition) 
        numberOfPollables++;

    if (this.bill) 
        numberOfPollables++;

    if (this.judgement) 
        numberOfPollables++;

    if (this.judicialOpinion) 
        numberOfPollables++;

    if (this.executiveAction) 
        numberOfPollables++;

    return numberOfPollables <= 1;
}

// Schema and Model Setup
var PollSchema = new Schema({
    government: {
        type: Schema.Types.ObjectId,
        ref: 'Government',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    governmentInstitution: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentInstitution',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    occupiedPosition: {
        type: Schema.Types.ObjectId,
        ref: 'OccupiedPosition',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    judgement: {
        type: Schema.Types.ObjectId,
        ref: 'Judgement',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    judicialOpinion: {
        type: Schema.Types.ObjectId,
        ref: 'JudicialOpinion',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    executiveAction: {
        type: Schema.Types.ObjectId,
        ref: 'ExecutiveAction',
        validate: {
            validator: pollableMutuallyExclusive,
            message: 'Only one pollable class allowed per Poll'
        }
    },
    pollResponses: {
        type: [Schema.Types.ObjectId],
        ref: 'PollResponse',
    },
    pollOptions: {
        type: [Schema.Types.ObjectId],
        ref: 'PollOption',
    }
});

var Poll = mongoose.model('Poll', PollSchema);

// Methods

// Create Methods 
var create = function() {
	return new Poll({
		_id: new mongoose.Types.ObjectId()
	}); 
}

// Save
var save = function(poll, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
            poll.save(function(err, saved){
                if (err) {
                    // if (errorMessage != null)
                    // 	console.log(errorMessage);

                    // console.error(err);
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
var compare = function(poll1, poll2) {
	match = true;
	message = '';

	if (poll1.government != poll2.government) {
		match = false;
		message += 'Governments do not match.' + poll1.government +' != ' + poll2.government + '\n';
	}

	if (poll1.governmentInstitution != poll2.governmentInstitution) {
		match = false;
		message += 'Government Institutions do not match.' + poll1.governmentInstitution +' != ' + poll2.governmentInstitution + '\n';
	}

	if (poll1.occupiedPosition != poll2.occupiedPosition) {
		match = false;
		message += 'Occupied Positions do not match.' + poll1.occupiedPosition +' != ' + poll2.occupiedPosition + '\n';
	}

	if (poll1.bill != poll2.bill) {
		match = false;
		message += 'Bills do not match.' + poll1.bill +' != ' + poll2.bill + '\n';
	}

	if (poll1.judgement != poll2.judgement) {
		match = false;
		message += 'Judgements do not match.' + poll1.judgement +' != ' + poll2.judgement + '\n';
	}

	if (poll1.judicialOpinion != poll2.judicialOpinion) {
		match = false;
		message += 'Judicial Opinions do not match.' + poll1.judicialOpinion +' != ' + poll2.judicialOpinion + '\n';
	}

	if (poll1.executiveAction != poll2.executiveAction) {
		match = false;
		message += 'Executive Actions do not match.' + poll1.executiveAction +' != ' + poll2.executiveAction + '\n';
	}

	if (poll1.pollResponses != null && poll2.pollResponses != null) {
		if (poll1.pollResponses.length != poll2.pollResponses.length) {
			match = false;
			message += "Poll Responses do not match. \n";
		}
		else {
			for (var i = 0; i < poll1.pollResponses.length; i++) {
				if (poll1.pollResponses[i] != poll2.pollResponses[i]) {
					match = false;
					message += "Poll Responses do not match. \n";

				}
			}
		}
	}

	if (poll1.pollOptions != null && poll2.pollOptions != null) {
		if (poll1.pollOptions.length != poll2.pollOptions.length) {
			match = false;
			message += "Poll Options do not match. \n";
		}
		else {
			for (var i = 0; i < poll1.pollOptions.length; i++) {
				if (poll1.pollOptions[i] != poll2.pollOptions[i]) {
					match = false;
					message += "Poll Options do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Polls Match';

	return {
		match: match, 
		message: message
	};
}


// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Poll.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

//Module Exports
exports.Model = Poll;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;
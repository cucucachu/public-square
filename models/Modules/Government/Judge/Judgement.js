/* 
 Mongoose Schema and Model Functions
 Model: Judgement 
 Description: Represents a collection of votes that were taken in the same session, for a particular JudicialCase. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var IndividualJudgement = require('./IndividualJudgement');
var JudicialCase = require('./JudicialCase');

// Schema and Model Setup
var JudgementSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    judicialCase: {
        type: Schema.Types.ObjectId,
        ref: 'JudicialCase',
        required: true
    },
    individualJudgements: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualJudgement'
    }
});

var Judgement = mongoose.model('Judgement', JudgementSchema);

//Methods 

// Create Method
var create = function() {
	return new Judgement({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judgement, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judgement.save(function(err, saved) {
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
var compare = function(judgement1, judgement2) {
    var match = true;
    var message = '';

    if (judgement1.date != judgement2.date) {
        match = false;
        message += 'Dates do not match. ' + judgement1.date +' != ' + judgement2.date + '\n';
    }

    if (judgement1.judicialCase != judgement2.judicialCase) {
        match = false;
        message += 'JudicialCases do not match. ' + judgement1.judicialCase +' != ' + judgement2.judicialCase + '\n';
    }

	if (judgement1.individualJudgements != null && judgement2.individualJudgements != null) {
		if (judgement1.individualJudgements.length != judgement2.individualJudgements.length) {
			match = false;
			message += "Individual Judgements do not match. \n";
		}
		else {
			for (var i = 0; i < judgement1.individualJudgements.length; i++) {
				if (judgement1.individualJudgements[i] != judgement2.individualJudgements[i]) {
					match = false;
					message += "Individual Judgements do not match. \n";

				}
			}
		}
	}


	if (match)
		message = 'Judgements Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Judgement.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Judgement;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


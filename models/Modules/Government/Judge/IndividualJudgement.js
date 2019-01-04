/* 
 Mongoose Schema and Model Functions
 Model: Individual Judgement
 Description: Represents a Judges's decission for a particular Judicial Case. Has a relationship to the Judge who made the decision, the Judgement
    (the class that groups the Individual Judgements), and the Judgement Option. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var Judge = require('./Judge');
var Judgement = require('./Judgement');
var JudgementOption = require('./JudgementOption');

// Schema and Model Setup
var IndividualJudgementSchema = new Schema({
    judge: {
        type: Schema.Types.ObjectId,
        ref: 'Judge',
        required: true
    },
    judgement: {
        type: Schema.Types.ObjectId,
        ref: 'Judgement',
        required: true
    },
    judgementOption: {
        type: Schema.Types.ObjectId,
        ref: 'JudgementOption',
        required: true
    }
});

var IndividualJudgement = mongoose.model('IndividualJudgement', IndividualJudgementSchema);

//Methods 

// Create Method
var create = function() {
	return new IndividualJudgement({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(individualJudgement, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		individualJudgement.save(function(err, saved) {
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
var compare = function(individualJudgement1, individualJudgement2) {
    var match = true;
    var message = '';

    if (individualJudgement1.judge != individualJudgement2.judge) {
        match = false;
        message += 'Judges do not match. ' + individualJudgement1.judge +' != ' + individualJudgement2.judge + '\n';
    }

    if (individualJudgement1.judgement != individualJudgement2.judgement) {
        match = false;
        message += 'Judgements do not match. ' + individualJudgement1.judgement +' != ' + individualJudgement2.judgement + '\n';
    }

    if (individualJudgement1.judgementOption != individualJudgement2.judgementOption) {
        match = false;
        message += 'Judgement Definitons do not match. ' + individualJudgement1.judgementOption +' != ' + individualJudgement2.judgementOption + '\n';
    }

	if (match)
		message = 'Individual Judgements Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		IndividualJudgement.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = IndividualJudgement;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


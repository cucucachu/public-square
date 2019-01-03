/* 
 Mongoose Schema and Model Functions
 Model: Judge
 Super Class: Government Role
 Description: A subclass of Government Role which enables judge functionallity. This ties an Occupied Position to voting on Judicial Cases, and
    writing Judicial Oppinions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');
var JudicialOpinion = require('./JudicialOpinion');
var IndividualJudgement = require('./IndividualJudgement');

// Schema and Model Setup
var JudgeSchema = new Schema({
    individualJudgements: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualJudgement'
    },
    writesJudicialOpinions: {
        type: [Schema.Types.ObjectId],
        ref: 'JudicialOpinion'
    },
    signsJudicialOpinions: {
        type: [Schema.Types.ObjectId],
        ref: 'JudicialOpinion'
    }
});

var Judge = GovernmentRole.Model.discriminator('Judge', JudgeSchema);

//Methods 

// Create Method
var create = function() {
	return new Judge({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judge, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judge.save(function(err, saved) {
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
var compare = function(judge1, judge2) {
    var match = true;
    var message = '';

    if (judge1.occupiedPosition != judge2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + judge1.occupiedPosition +' != ' + judge2.occupiedPosition + '\n';
    }

	if (judge1.individualJudgements != null && judge2.individualJudgements != null) {
		if (judge1.individualJudgements.length != judge2.individualJudgements.length) {
			match = false;
			message += "Individual Judgements do not match. \n";
		}
		else {
			for (var i = 0; i < judge1.individualJudgements.length; i++) {
				if (judge1.individualJudgements[i] != judge2.individualJudgements[i]) {
					match = false;
					message += "Individual Judgements  do not match. \n";

				}
			}
		}
	}

	if (judge1.writesJudicialOpinions != null && judge2.writesJudicialOpinions != null) {
		if (judge1.writesJudicialOpinions.length != judge2.writesJudicialOpinions.length) {
			match = false;
			message += "Writes Judicial Opinions do not match. \n";
		}
		else {
			for (var i = 0; i < judge1.writesJudicialOpinions.length; i++) {
				if (judge1.writesJudicialOpinions[i] != judge2.writesJudicialOpinions[i]) {
					match = false;
					message += "Writes Judicial Opinions do not match. \n";

				}
			}
		}
	}

	if (judge1.signsJudicialOpinions != null && judge2.signsJudicialOpinions != null) {
		if (judge1.signsJudicialOpinions.length != judge2.signsJudicialOpinions.length) {
			match = false;
			message += "Signs Judicial Opinions do not match. \n";
		}
		else {
			for (var i = 0; i < judge1.signsJudicialOpinions.length; i++) {
				if (judge1.signsJudicialOpinions[i] != judge2.signsJudicialOpinions[i]) {
					match = false;
					message += "Signs Judicial Opinions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Judges Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Judge.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Judge;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


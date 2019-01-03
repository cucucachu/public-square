/* 
 Mongoose Schema and Model Functions
 Model: Judgement Definition
 Super Class: Vote Definition
 Description: Represents a possible judgement for a Judicial Case. Because outcomes can be more than a simple 'Yay' or 'Nay', this class 
    captures all the posible properties of a judgement, such as, does the judgement count as positive or negative, does it count
    toward the total number of judgements cast, etc.

 1 Way Relationships Targeting this Class: Individual Judgement has one Judgement Definition
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var VoteDefinition = require('../VoteDefinition');

// Schema and Model Setup
var JudgementDefinitionSchema = new Schema({
});

var JudgementDefinition = VoteDefinition.Model.discriminator('JudgementDefinition', JudgementDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new JudgementDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judgementDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judgementDefinition.save(function(err, saved) {
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
var compare = function(judgementDefinition1, judgementDefinition2) {
    var match = true;
    var message = '';

    if (judgementDefinition1.name != judgementDefinition2.name) {
        match = false;
        message += 'Names do not match. ' + judgementDefinition1.name +' != ' + judgementDefinition2.name + '\n';
    }

    if (judgementDefinition1.positive != judgementDefinition2.positive) {
        match = false;
        message += 'Positives do not match. ' + judgementDefinition1.positive +' != ' + judgementDefinition2.positive + '\n';
    }

    if (judgementDefinition1.negative != judgementDefinition2.negative) {
        match = false;
        message += 'Negatives do not match. ' + judgementDefinition1.negative +' != ' + judgementDefinition2.negative + '\n';
    }

    if (judgementDefinition1.countsTowardsTotal != judgementDefinition2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + judgementDefinition1.countsTowardsTotal +' != ' + judgementDefinition2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Judgement Definitions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		JudgementDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = JudgementDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


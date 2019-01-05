/* 
 Mongoose Schema and Model Functions
 Model: Judgement Option
 Super Class: Vote Option
 Description: Represents a possible judgement for a Judicial Case. Because outcomes can be more than a simple 'Yay' or 'Nay', this class 
    captures all the posible properties of a judgement, such as, does the judgement count as positive or negative, does it count
    toward the total number of judgements cast, etc.

 1 Way Relationships Targeting this Class: Individual Judgement has one Judgement Option
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var VoteOption = require('../VoteOption');

// Schema and Model Setup
var JudgementOptionSchema = new Schema({
});

var JudgementOption = VoteOption.Model.discriminator('JudgementOption', JudgementOptionSchema);

//Methods 

// Create Method
var create = function() {
	return new JudgementOption({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judgementOption, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judgementOption.save(function(err, saved) {
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
var compare = function(judgementOption1, judgementOption2) {
    var match = true;
    var message = '';

    if (judgementOption1.name != judgementOption2.name) {
        match = false;
        message += 'Names do not match. ' + judgementOption1.name +' != ' + judgementOption2.name + '\n';
    }

    if (judgementOption1.positive != judgementOption2.positive) {
        match = false;
        message += 'Positives do not match. ' + judgementOption1.positive +' != ' + judgementOption2.positive + '\n';
    }

    if (judgementOption1.negative != judgementOption2.negative) {
        match = false;
        message += 'Negatives do not match. ' + judgementOption1.negative +' != ' + judgementOption2.negative + '\n';
    }

    if (judgementOption1.countsTowardsTotal != judgementOption2.countsTowardsTotal) {
        match = false;
        message += 'Counts Toward Totals do not match. ' + judgementOption1.countsTowardsTotal +' != ' + judgementOption2.countsTowardsTotal + '\n';
    }

	if (match)
		message = 'Judgement Options Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		JudgementOption.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = JudgementOption;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


/* 
 ClassModel 
 Model: Judge
 Super Class: Government Role
 Description: A subclass of Government Role which enables judge functionallity. This ties an Occupied Position to voting on Judicial Cases, and
    writing Judicial Oppinions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Judge = new ClassModel({
	className: 'Judge',
	accessControlled: false,
	updateControlled: false,
	superClasses: [GovernmentRole],
	schema: {
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
	}
});

module.exports = Judge;

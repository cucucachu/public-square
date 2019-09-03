/* 
 Class Model
 Model: Executive Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Group Executive Action. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ExecutiveVote = new ClassModel({
	className: 'ExecutiveVote',
	accessControlled: false,
	schema: {
		date: {
			type: Date,
			required: true
		},
		groupExecutiveAction: {
			type: Schema.Types.ObjectId,
			ref: 'GroupExecutiveAction',
			required: true
		},
		individualExecutiveVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualExecutiveVote'
		}
	}
});

module.exports = ExecutiveVote;

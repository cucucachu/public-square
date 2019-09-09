/* 
 Class Model
 Model: Confirmation Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Nomination. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ConfirmationVote = new ClassModel({
	className: 'ConfirmationVote',
	accessControlled: false,
	updateControlled: false,
	schema: {
		date: {
			type: Date,
			required: true
		},
		nomination: {
			type: Schema.Types.ObjectId,
			ref: 'Nomination',
			required: true
		},
		individualConfirmationVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualConfirmationVote'
		}
	}
});

module.exports = ConfirmationVote;

/* 
 Mongoose Schema and Model Functions
 Model: Legislative Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Bill. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var LegislativeVote = new ClassModel({
	className: 'LegislativeVote',
	accessControlled: false,
	updateControlled: false,
	schema: {
		date: {
			type: Date,
			required: true
		},
		billVersion: {
			type: Schema.Types.ObjectId,
			ref: 'BillVersion',
			required: true
		},
		individualLegislativeVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualLegislativeVote'
		}
	}
});

module.exports = LegislativeVote;

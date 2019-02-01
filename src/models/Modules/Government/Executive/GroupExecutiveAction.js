/* 
 Class Model
 Model: Group Executive Action
 Discriminator Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which requires a group vote.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ExecutiveAction = require('./ExecutiveAction');

var GroupExecutiveAction = new ClassModel({
	className: 'GroupExecutiveAction',
	discriminatorSuperClass: ExecutiveAction,
	schema: {
		executiveVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'ExecutiveVote'
		}
	}
});

module.exports = GroupExecutiveAction;

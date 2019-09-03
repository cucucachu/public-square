/* 
 Class Model
 Model: Confirmer
 Super Class: Government Role
 Description: A subclass of Government Role which enables confirmer functionallity. This ties an Occupied Position to allow casting Confirmation
    Votes for a Nomination
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Confirmer = new ClassModel({
	className: 'Confirmer',
	accessControlled: false,
	superClasses: [GovernmentRole],
	schema: {
		individualConfirmationVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualConfirmationVote'
		}
	}
});

module.exports = Confirmer;


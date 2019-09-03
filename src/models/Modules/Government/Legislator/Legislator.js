/* 
 Class Model
 Model: Legislator
 Super Class: Government Role
 Description: A subclass of Government Role which enables legislator functionallity. This ties an Occupied Position to allow proposing,
    sponsoring, and voting on Bills. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Legislator = new ClassModel({
	className: 'Legislator',
	accessControlled: false,
	superClasses: [GovernmentRole],
	schema: {
		individualLegislativeVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualLegislativeVote'
		},
		billSponsorships: {
			type: [Schema.Types.ObjectId],
			ref: 'BillSponsorship'
		},
		billVersions: {
			type: [Schema.Types.ObjectId],
			ref: 'BillVersion'
		}
	}
});

module.exports = Legislator;

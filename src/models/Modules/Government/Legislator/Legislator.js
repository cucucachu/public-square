/* 
 Class Model: Legislator
 Super Class: Government Role
 Description: A subclass of Government Role which enables legislator functionallity. This ties an Occupied Position to allow proposing,
    sponsoring, and voting on Bills. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Legislator = new ClassModel({
	className: 'Legislator',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'individualLegislativeVotes',
			toClass: 'IndividualLegislativeVote',
			mirrorRelationship: 'legislator',
			singular: false,
		},
		{
			name: 'billSponsorShips',
			toClass: 'BillSponsorship',
			mirrorRelationship: 'legislator',
			singular: false,
		},
		{
			name: 'billVersions',
			toClass: 'BillVersion',
			mirrorRelationship: 'legislators',
			singular: false,
		},
	],
});

module.exports = Legislator;

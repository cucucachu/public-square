/* 
 Class Model: Executive
 Super Class: Government Role
 Description: A subclass of Government Role which enables executive functionallity. This ties an Occupied Position to voting executive actions.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Executive = new ClassModel({
	className: 'Executive',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'individualExecutiveVotes',
			toClass: 'IndividualExecutiveVote',
			mirrorRelationship: 'executive',
			singular: false,
		},
		{
			name: 'executiveActions',
			toClass: 'ExecutiveAction',
			mirrorRelationship: 'executives',
			singular: false,
		},
	],
});

module.exports = Executive;

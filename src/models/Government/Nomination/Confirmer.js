/* 
 Class Model: Confirmer
 Super Class: Government Role
 Description: A subclass of Government Role which enables confirmer functionallity. This ties an Occupied Position to allow casting Confirmation
    Votes for a Nomination
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Confirmer = new ClassModel({
	className: 'Confirmer',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'individualConfirmationVotes',
			toClass: 'IndividualConfirmationVote',
			mirrorRelationship: 'confirmer',
			singular: false,
		},
	],
});

module.exports = Confirmer;


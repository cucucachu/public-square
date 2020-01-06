/* 
 Class Model: Confirmation Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Nomination. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ConfirmationVote = new ClassModel({
	className: 'ConfirmationVote',
	attributes: [
		{
			name: 'date',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'nomination',
			toClass: 'Nomination',
			mirrorRelationship: 'confirmationVotes',
			singular: true,
			required: true,
		},
		{
			name: 'individualConfirmationVotes',
			toClass: 'IndividualConfirmationVote',
			mirrorRelationship: 'confirmationVote',
			singular: false,
		},
	],
});

module.exports = ConfirmationVote;

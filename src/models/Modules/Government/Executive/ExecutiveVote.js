/* 
 Class Model
 Model: Executive Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Group Executive Action. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExecutiveVote = new ClassModel({
	className: 'ExecutiveVote',
	attributes: [
		{
			name: 'date',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'groupExecutiveAction',
			toClass: 'GroupExecutiveAction',
			mirrorRelationship: 'executiveVotes',
			singular: true,
			required: true,
		},
		{
			name: 'individualExecutiveVotes',
			toClass: 'IndividualExecutiveVote',
			mirrorRelationship: 'executiveVote',
			singular: false,
		}
	],
});

module.exports = ExecutiveVote;

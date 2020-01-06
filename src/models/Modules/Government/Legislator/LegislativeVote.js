/* 
 Class Model: Legislative Vote 
 Description: Represents a collection of votes that were taken in the same session, for a particular Bill. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const LegislativeVote = new ClassModel({
	className: 'LegislativeVote',
	attributes: [
		{
			name: 'date',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'billVersion',
			toClass: 'BillVersion',
			mirrorRelationship: 'legislativeVotes',
			singular: true,
			required: true,
		},
		{
			name: 'individualLegislativeVotes',
			toClass: 'IndividualLegislativeVote',
			mirrorRelationship: 'legislativeVote',
			singular: false,
		}
	],
});

module.exports = LegislativeVote;

/* 
 Class Model: Campaign
 Description: Joiner class between Government Position and Election. Relates a Election to a Position Definition for a given date range.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var Campaign = new ClassModel({
	className: 'Campaign',
	relationships: [
		{
			name: 'candidate',
			toClass: 'Candidate',
			mirrorRelationship: 'campaigns',
			singular: true,
			required: true,
		},
		{
			name: 'election',
			toClass: 'Election',
			mirrorRelationship: 'campaigns',
			singular: true,
			required: true,
		},
		{
			name: 'electionResults',
			toClass: 'ElectionResult',
			mirrorRelationship: 'campaign',
			singular: false,
		},
	],
});

module.exports = Campaign;
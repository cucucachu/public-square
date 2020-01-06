/* 
 Class Model: Judicial Case
 Description: Represents a legal case that a judge might hear. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const JudicialCase = new ClassModel({
	className: 'JudicialCase',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
		{
			name: 'filedDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'judgements',
			toClass: 'Judgement',
			mirrorRelationship: 'judicialCase',
			singular: false,
		},
		{
			name: 'judicialOpinions',
			toClass: 'JudicialOpinion',
			mirrorRelationship: 'judicialCase',
			singular: false,
		},
	],
});

module.exports = JudicialCase;

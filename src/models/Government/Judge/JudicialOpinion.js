/* 
 Class Model: Judicial Opinion
 Super Class(es): Pollable
 Description: Represents an oppinion written by a judge or judges about a particular case. Other judges can also be signers of the opinion.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../../Poll/Pollable');

const JudicialOpinion = new ClassModel({
	className: 'JudicialOpinion',
	superClasses: [Pollable],
	attributes: [
		{
			name: 'text',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'judicialCase',
			toClass: 'JudicialCase',
			mirrorRelationship: 'judicialOpinions',
			singular: true,
		},
		{
			name: 'writtenByJudges',
			toClass: 'Judge',
			mirrorRelationship: 'writesJudicialOpinions',
			singular: false,
		},
		{
			name: 'signedByJudges',
			toClass: 'Judge',
			mirrorRelationship: 'signsJudicialOpinions',
			singular: false,
		},
		{
			name: 'laws',
			toClass: 'Law',
			mirrorRelationship: 'judicialOpinions',
			singular: false,
		},
	],
});

module.exports = JudicialOpinion;
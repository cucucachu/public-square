/* 
 Class Model: Judgement 
 Description: Represents a collection of votes that were taken in the same session, for a particular JudicialCase. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../../Poll/Pollable');

const Judgement = new ClassModel({
	className: 'Judgement',
	superClasses: [Pollable],
	attributes: [
		{
			name: 'date',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'judicialCase',
			toClass: 'JudicialCase',
			mirrorRelationship: 'judgements',
			singular: true,
			required: true,
		},
		{
			name: 'individualJudgements',
			toClass: 'IndividualJudgement',
			mirrorRelationship: 'judgement',
			singular: false,
		},
	],
});

module.exports = Judgement;

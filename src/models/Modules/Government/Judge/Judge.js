/* 
 Class Model: Judge
 Super Class: Government Role
 Description: A subclass of Government Role which enables judge functionallity. This ties an Occupied Position to voting on Judicial Cases, and
    writing Judicial Oppinions.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Judge = new ClassModel({
	className: 'Judge',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'individualJudgements',
			toClass: 'IndividualJudgement',
			mirrorRelationship: 'judge',
			singular: false,		
		},
		{
			name: 'writesJudicialOpinions',
			toClass: 'JudicialOpinion',
			mirrorRelationship: 'writtenByJudges',
			singular: false,
		},
		{
			name: 'signsJudicialOpinions',
			toClass: 'JudicialOpinion',
			mirrorRelationship: 'signedByJudges',
			singular: false,
		},
	],
});

module.exports = Judge;

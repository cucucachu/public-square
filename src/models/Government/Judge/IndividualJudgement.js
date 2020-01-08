/* 
 Class Model: Individual Judgement
 Description: Represents a Judges's decission for a particular Judicial Case. Has a relationship to the Judge who made the decision, the Judgement
    (the class that groups the Individual Judgements), and the Judgement Option. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const IndividualJudgement = new ClassModel({
    className: 'IndividualJudgement',
    relationships: [
        {
            name: 'judge',
            toClass: 'Judge',
            mirrorRelationship: 'individualJudgements',
            singular: true,
            required: true,
        },
        {
            name: 'judgement',
            toClass: 'Judgement',
            mirrorRelationship: 'individualJudgements',
            singular: true,
            required: true,
        },
        {
            name: 'judgementOption',
            toClass: 'JudgementOption',
            singular: true,
            required: true,
        },
    ],
});

module.exports = IndividualJudgement;

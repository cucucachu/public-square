/* 
 Class Model: Individual Executive Vote
 Description: Represents a Executive's vote on a particular Executive Actiong. Has a relationship to the Executive who made the decision, the 
    Executive Vote (group) and the Executive Vote Option chosen. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const IndividualExecutiveVote = new ClassModel({
    className: 'IndividualExecutiveVote',
    relationships: [
        {
            name: 'executive',
            toClass: 'Executive',
            mirrorRelationship: 'individualExecutiveVotes',
            singular: true,
            required: true,
        },
        {
            name: 'executiveVote',
            toClass: 'ExecutiveVote',
            mirrorRelationship: 'individualExecutiveVotes',
            singular: true,
            required: true,
        },
        {
            name: 'executiveVoteOption',
            toClass: 'ExecutiveVoteOption',
            singular: true,
            required: true,
        },
    ],
});

module.exports = IndividualExecutiveVote;

/* 
 Class Model: Individual Legislative Vote
 Description: Represents a Legislator's vote for a particular Bill. Has a relationship to the Legislator who casted the vote, the Legislate Vote
    (the class that groups the votes), and the Legislative Vote Option. The Legislative Vote Option can be thought of as the actual 'Yay'
    or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const IndividualLegislativeVote = new ClassModel({
    className: 'IndividualLegislativeVote',
    relationships: [
        {
            name: 'legislator',
            toClass: 'Legislator',
            mirrorRelationship: 'individualLegislativeVotes',
            singular: true,
            required: true,
        },
        {
            name: 'legislativeVote',
            toClass: 'LegislativeVote',
            mirrorRelationship: 'individualLegislativeVotes',
            singular: true,
            required: true,
        },
        {
            name: 'legislativeVoteOption',
            toClass: 'LegislativeVoteOption',
            singular: true,
            required: true,
        },
    ],
});

module.exports = IndividualLegislativeVote;

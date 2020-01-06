/* 
 Class Model: Individual Confirmation Vote
 Description: Represents a Confirmers's vote for a particular Nomination. Has a relationship to the Confirmer who casted the vote, the Confirmation 
    Vote (the class that groups the votes), and the Confirmation Vote Option. The Confirmation Vote Option can be thought of as the actual
    'Yay' or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const IndividualConfirmationVote = new ClassModel({
    className: 'IndividualConfirmationVote',
    relationships: [
        {
            name: 'confirmer',
            toClass: 'Confirmer',
            mirrorRelationship: 'individualConfirmationVotes',
            singular: true,
            required: true,
        },
        {
            name: 'confirmationVote',
            toClass: 'ConfirmationVote',
            mirrorRelationship: 'individualConfirmationVotes',
            singular: true,
            required: true,
        },
        {
            name: 'confirmationVoteOption',
            toClass: 'ConfirmationVoteOption',
            singular: true,
            required: true,
        },
    ],
});

module.exports = IndividualConfirmationVote;

/* 
 Class Model
 Model: Individual Confirmation Vote
 Description: Represents a Confirmers's vote for a particular Nomination. Has a relationship to the Confirmer who casted the vote, the Confirmation 
    Vote (the class that groups the votes), and the Confirmation Vote Option. The Confirmation Vote Option can be thought of as the actual
    'Yay' or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var IndividualConfirmationVote = new ClassModel({
    className: 'IndividualConfirmationVote',
	accessControlled: false,
    schema: {
        confirmer: {
            type: Schema.Types.ObjectId,
            ref: 'Confirmer',
            required: true
        },
        confirmationVote: {
            type: Schema.Types.ObjectId,
            ref: 'ConfirmationVote',
            required: true
        },
        confirmationVoteOption: {
            type: Schema.Types.ObjectId,
            ref: 'ConfirmationVoteOption',
            required: true
        }
    }
});

module.exports = IndividualConfirmationVote;

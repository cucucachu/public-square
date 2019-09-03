/* 
 Class Model
 Model: Individual Legislative Vote
 Description: Represents a Legislator's vote for a particular Bill. Has a relationship to the Legislator who casted the vote, the Legislate Vote
    (the class that groups the votes), and the Legislative Vote Option. The Legislative Vote Option can be thought of as the actual 'Yay'
    or 'Nay' vote. The reason we store on another class is for reusability, but also for flexibility. Some votes may have more than just 'Yay'
    or 'Nay'. For instance, there might be 'Abstain' or 'Absent', and how to count those votes can vary by institution.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var IndividualLegislativeVote = new ClassModel({
    className: 'IndividualLegislativeVote',
	accessControlled: false,
    schema: {
        legislator: {
            type: Schema.Types.ObjectId,
            ref: 'Legislator',
            required: true
        },
        legislativeVote: {
            type: Schema.Types.ObjectId,
            ref: 'LegislativeVote',
            required: true
        },
        legislativeVoteOption: {
            type: Schema.Types.ObjectId,
            ref: 'LegislativeVoteOption',
            required: true
        }
    }
});

module.exports = IndividualLegislativeVote;

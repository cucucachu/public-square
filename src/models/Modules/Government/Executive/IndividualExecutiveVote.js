/* 
 Mongoose Schema and Model Functions
 Model: Individual Executive Vote
 Description: Represents a Executive's vote on a particular Executive Actiong. Has a relationship to the Executive who made the decision, the 
    Executive Vote (group) and the Executive Vote Option chosen. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var IndividualExecutiveVote = new ClassModel({
    className: 'IndividualExecutiveVote',
	accessControlled: false,
	updateControlled: false,
    schema: {
        executive: {
            type: Schema.Types.ObjectId,
            ref: 'Executive',
            required: true
        },
        executiveVote: {
            type: Schema.Types.ObjectId,
            ref: 'ExecutiveVote',
            required: true
        },
        executiveVoteOption: {
            type: Schema.Types.ObjectId,
            ref: 'ExecutiveVoteOption',
            required: true
        }
    }
});

module.exports = IndividualExecutiveVote;

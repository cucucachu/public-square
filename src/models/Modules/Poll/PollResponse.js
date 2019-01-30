/* 
 Class Model
 Model: Poll Resonse  
 Description: Represents a users response to a Poll. User picks a Poll Option. The relationship to Civilian will always be set, but the relationship
    to citizen will only be set for verified citizens/voters.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PollResponse = new ClassModel({
    className: 'PollResponse',
    schema: {
        comment: {
            type: String
        },
        latest: {
            type: Boolean
        },
        date: {
            type: Date,
            required: true
        },
        civilian: {
            type: Schema.Types.ObjectId,
            ref: 'Civilian',
            required: true
        },
        citizen: {
            type: Schema.Types.ObjectId,
            ref: 'Citizen'
        },
        poll: {
            type: Schema.Types.ObjectId,
            ref: 'Poll',
            required: true
        },
        pollOption: {
            type: Schema.Types.ObjectId,
            ref: 'PollOption',
            required: true
        }
    }
});

module.exports = PollResponse;
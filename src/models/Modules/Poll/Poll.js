/* 
 Mongoose Schema and Model Functions
 Model: Poll
 Description: A joiner class between a pollable object and polling data. Has a relationship to individual Poll Responses and available Polling
    Options.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var ClassModel = require('../../ClassModel');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Poll = new ClassModel({
    className: 'Poll',
	accessControlled: false,
	updateControlled: false,
    schema: {
        pollable: {
            type: Schema.Types.ObjectId,
            ref: 'Pollable',
            required: true
        },
        pollResponses: {
            type: [Schema.Types.ObjectId],
            ref: 'PollResponse',
        },
        pollOptions: {
            type: [Schema.Types.ObjectId],
            ref: 'PollOption',
        }
    }
});

module.exports = Poll;
/* 
 Class Model: Poll Resonse  
 Description: Represents a users response to a Poll. User picks a Poll Option. The relationship to Civilian will always be set, but the relationship
    to citizen will only be set for verified citizens/voters.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PollResponse = new ClassModel({
    className: 'PollResponse',
    attributes: [
        {
            name: 'comment',
            type: String,
        },
        {
            name: 'latest',
            type: Boolean,
        }, 
        {
            name: 'date',
            type: Date,
            required: true,
        },
    ],
    relationships: [
        {
            name: 'civilian',
            toClass: 'Civilian',
            mirrorRelationship: 'pollResponses',
            singular: true,
            required: true,
        },
        {
            name: 'citizen',
            toClass: 'Citizen',
            mirrorRelationship: 'pollResponses',
            singular: true,
        },
        {
            name: 'poll',
            toClass: 'Poll',
            mirrorRelationship: 'pollResponses',
            singular: true,
            required: true,
        },
        {
            name: 'pollOption',
            toClass: 'PollOption',
            singular: true,
            required: true,
        },
    ],
});

module.exports = PollResponse;
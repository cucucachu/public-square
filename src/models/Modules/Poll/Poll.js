/* 
 Class Model: Poll
 Description: A joiner class between a pollable object and polling data. Has a relationship to individual Poll Responses and available Polling
    Options.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Poll = new ClassModel({
    className: 'Poll',
    relationships: [
        {
            name: 'pollable',
            toClass: 'Pollable',
            mirrorRelationship: 'poll',
            singular: true,
            required: true,
        },
        {
            name: 'pollResponses',
            toClass: 'PollResponse',
            mirrorRelationship: 'poll',
            singular: false,
        },
        {
            name: 'pollOptions',
            toClass: 'PollOption',
            singular: false,
        },
    ],
});

module.exports = Poll;
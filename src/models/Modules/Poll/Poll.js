/* 
 Mongoose Schema and Model Functions
 Model: Poll
 Description: A joiner class between a pollable object and polling data. Has a relationship to individual Poll Responses and available Polling
    Options.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var ClassModel = require('../../ClassModel');
var database = require('../../database').database;
var Schema = mongoose.Schema;

// Schema and Model Setup
var PollSchema = new Schema({
    government: {
        type: Schema.Types.ObjectId,
        ref: 'Government',
        mutex: 'a',
        requiredGroup: 'a'
    },
    governmentInstitution: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentInstitution',
        mutex: 'a',
        requiredGroup: 'a'
    },
    occupiedPosition: {
        type: Schema.Types.ObjectId,
        ref: 'OccupiedPosition',
        mutex: 'a',
        requiredGroup: 'a'
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        mutex: 'a',
        requiredGroup: 'a'
    },
    judgement: {
        type: Schema.Types.ObjectId,
        ref: 'Judgement',
        mutex: 'a',
        requiredGroup: 'a'
    },
    judicialOpinion: {
        type: Schema.Types.ObjectId,
        ref: 'JudicialOpinion',
        mutex: 'a',
        requiredGroup: 'a'
    },
    executiveAction: {
        type: Schema.Types.ObjectId,
        ref: 'ExecutiveAction',
        mutex: 'a',
        requiredGroup: 'a'
    },
    pollResponses: {
        type: [Schema.Types.ObjectId],
        ref: 'PollResponse',
    },
    pollOptions: {
        type: [Schema.Types.ObjectId],
        ref: 'PollOption',
    }
});

var Poll = new ClassModel({
    className: 'Poll',
    schema: PollSchema
});

module.exports = Poll;
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

// Validation Methods


// Returns false if more than one of the Pollable relationships is set.
var pollableMutuallyExclusive = function() {
    var numberOfPollables = 0;

    if (this.government) 
        numberOfPollables++;

    if (this.governmentInstitution) 
        numberOfPollables++;

    if (this.occupiedPosition) 
        numberOfPollables++;

    if (this.bill) 
        numberOfPollables++;

    if (this.judgement) 
        numberOfPollables++;

    if (this.judicialOpinion) 
        numberOfPollables++;

    if (this.executiveAction) 
        numberOfPollables++;

    return numberOfPollables <= 1;
}

// Schema and Model Setup
var PollSchema = new Schema({
    government: {
        type: Schema.Types.ObjectId,
        ref: 'Government',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    governmentInstitution: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentInstitution',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    occupiedPosition: {
        type: Schema.Types.ObjectId,
        ref: 'OccupiedPosition',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    judgement: {
        type: Schema.Types.ObjectId,
        ref: 'Judgement',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    judicialOpinion: {
        type: Schema.Types.ObjectId,
        ref: 'JudicialOpinion',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
    },
    executiveAction: {
        type: Schema.Types.ObjectId,
        ref: 'ExecutiveAction',
        mutex: 'a'
        // validate: {
        //     validator: pollableMutuallyExclusive,
        //     message: 'Only one pollable class allowed per Poll'
        // }
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
/* 
 Class model
 Model: Election Result
 Discriminated Sub Classes: Primary Election Result
 Description: Holds the vote counts for an election, for a particular Geographic Area and Campaign. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ElectionResult = new ClassModel({
    className: 'ElectionResult',
    discriminated: true,
	accessControlled: false,
	updateControlled: false,
    schema: {
        citizenVotes: {
            type: Number
        },
        representativeVotes: {
            type: Number
        },
        campaign: {
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
            required: true
        },
        geographicArea: {
            type: Schema.Types.ObjectId,
            ref: 'GeographicArea',
            required: true
        }
    }
})

module.exports = ElectionResult;

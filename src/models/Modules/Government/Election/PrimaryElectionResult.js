/* 
 Class Model
 Model: Primary Election Result
 Discriminated Super Class: Election Result
 Description: Holds the vote counts for a primary election, for a particular Geographic Area and Campaign. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ElectionResult = require('./ElectionResult');

var PrimaryElectionResult = new ClassModel({
    className: 'PrimaryElectionResult',
    discriminatorSuperClass: ElectionResult,
	accessControlled: false,
	updateControlled: false,
    schema: {
        citizenVotes: {
            type: Number
        },
        representitiveVotes: {
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
});

module.exports = PrimaryElectionResult;

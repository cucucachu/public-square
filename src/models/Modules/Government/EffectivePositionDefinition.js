/* 
 Class Model
 Model: Effective Position Definition
 Description: Joiner class between Government Position and Position Definition. Relates a Government Position to a Position Definition for a given date range.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var EffectivePositionDefinition = new ClassModel({
    className: 'EffectivePositionDefinition',
	accessControlled: false,
    schema: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date
        },
        governmentPosition: {
            type: Schema.Types.ObjectId,
            ref: 'GovernmentPosition',
            required: true
        },
        positionDefinition: {
            type: Schema.Types.ObjectId,
            ref: 'PositionDefinition',
            required: true
        }
    }
});

module.exports = EffectivePositionDefinition;
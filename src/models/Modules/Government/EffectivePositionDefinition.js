/* 
 Class Model: Effective Position Definition
 Description: Joiner class between Government Position and Position Definition. Relates a Government Position to a Position Definition for a given date range.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const EffectivePositionDefinition = new ClassModel({
    className: 'EffectivePositionDefinition',
    attributes: [
        {
            name: 'startDate',
            type: Date,
            required: true,
        },
        {
            name: 'endDate',
            type: Date,
        },
    ],
    relationships: [
        {
            name: 'governmentPosition',
            toClass: 'GovernmentPosition',
            mirrorRelationship: 'effectivePositionDefinitions',
            singular: true,
            required: true,
        },
        {
            name: 'positionDefinition',
            toClass: 'PositionDefinition',
            mirrorRelationship: 'effectivePositionDefinitions',
            singular: true,
            required: true,
        },
    ],
});

module.exports = EffectivePositionDefinition;
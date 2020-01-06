/* 
 Class Model: Election Result
 Discriminated Sub Classes: Primary Election Result
 Description: Holds the vote counts for an election, for a particular Geographic Area and Campaign. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var ElectionResult = new ClassModel({
    className: 'ElectionResult',
    attributes: [
        {
            name: 'citizenVotes',
            type: Number,
        },
        {
            name: 'representativeVotes',
            type: Number,
        },
    ],
    relationships: [
        {
            name: 'campaign',
            toClass: 'Campaign',
            mirrorRelationship: 'electionResults',
            singular: true,
            required: true,
        },
        {
            name: 'geographicArea',
            toClass: 'GeographicArea',
            mirrorRelationship: 'electionResults',
            singular: true,
            required: true,
        }
    ],
})

module.exports = ElectionResult;

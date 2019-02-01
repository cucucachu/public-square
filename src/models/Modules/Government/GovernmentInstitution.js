/* 
 Class Model
 Model: Government Institution
 Description: Defines individual institutions or departments that make up a Government. For example, a single city government might have Government
    Instituations for the Police Department, the School Board, the City Council, etc. A Government Institution may also have multiple Government
    Positions. For a Government Institution for a City Council, there may be positions for Board Chair, Board Member, Treasurer, etc.
    Government Institutions exist in a tree struction, with only the root institution having a relationship to a Government. For example,
    the California State Legislature might have a relationship to the California State Government, and have 2 child Government Institutions,
    the State Assembly and the State Senate.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GovernmentInstitution = new ClassModel({
    className: 'GovernmentInstitution',
    schema: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        government: {
            type: Schema.Types.ObjectId,
            ref: 'Government',
            requiredGroup: 'a',
            mutex: 'a'
        },
        governmentPositions: {
            type: [Schema.Types.ObjectId],
            ref: 'GovernmentPosition'
        },
        parentGovernmentInstitution: {
            type: Schema.Types.ObjectId,
            ref: 'GovernmentInstitution',
            requiredGroup: 'a',
            mutex: 'a'
        },
        childGovernmentInstitutions: {
            type: [Schema.Types.ObjectID],
            ref: 'GovernmentInstitution'
        }
    }
});

module.exports = GovernmentInstitution;
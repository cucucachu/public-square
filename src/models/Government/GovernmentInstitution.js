/* 
 Class Model: Government Institution
 Super Class(es): Pollable
 Description: Defines individual institutions or departments that make up a Government. For example, a single city government might have Government
    Instituations for the Police Department, the School Board, the City Council, etc. A Government Institution may also have multiple Government
    Positions. For a Government Institution for a City Council, there may be positions for Board Chair, Board Member, Treasurer, etc.
    Government Institutions exist in a tree struction, with only the root institution having a relationship to a Government. For example,
    the California State Legislature might have a relationship to the California State Government, and have 2 child Government Institutions,
    the State Assembly and the State Senate.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../Poll/Pollable');

const GovernmentInstitution = new ClassModel({
    className: 'GovernmentInstitution',
    superClasses: [Pollable],
    attributes: [
        {
            name: 'name',
            type: String,
            required: true,
        },
        {
            name: 'description',
            type: String,
        },
    ],
    relationships: [
        {
            name: 'government',
            toClass: 'Government',
            mirrorRelationship: 'governmentInstitution',
            singular: true,
            requiredGroup: 'a',
            mutex: 'a',
        },
        {
            name: 'governmentPositions',
            toClass: 'GovernmentPosition',
            mirrorRelationship: 'governmentInstitution',
            singular: false,
        },
        {
            name: 'parentGovernmentInstatution',
            toClass: 'GovernmentInstitution',
            mirrorRelationship: 'childGovernmentInstitutions',
            singular: true,
            requiredGroup: 'a',
            mutex: 'a',
        },
        {
            name: 'childGovernmentInstitutions',
            toClass: 'GovernmentInstitution',
            mirrorRelationship: 'parentGovernmentInstatution',
            singular: false,
        }
    ],
});

module.exports = GovernmentInstitution;
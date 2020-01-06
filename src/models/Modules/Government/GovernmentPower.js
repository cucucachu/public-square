/* 
 Class Model: Government Power
 Description: Describes different powers available to a Government Position. These will be used to determine what functionalities and data 
    are available to a Position. For instance, an instance of Government Power might be 'Legislative', giving a position access to the
    functionality to draft, sponsor, and vote on bills. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentPower = new ClassModel({
    className: 'GovernmentPower',
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
            name: 'positionDefinitions',
            toClass: 'PositionDefinition',
            mirrorRelationship: 'governmentPowers',
            singular: false,
        },
    ],
});

module.exports = GovernmentPower;
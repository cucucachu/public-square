/* 
 Class Model: Acquisition Process Definition
 Description: Describes how a Government Position becomes filled. Some examples might be Direct Election, Indirect Election (like electoral
    college), Appointment, Appointment with Confirmation, etc. The Acquisition Process Definition for a particular Position Details will grant 
    functionality to a Government Position. For example, if a Position has a Acquisition Process of Appointment with Confirmation, then a its 
    Government Position will have a relationship to a Appointment Position Acquisition Process. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const AcquisitionProcessDefinition = new ClassModel({
    className: 'AcquisitionProcessDefinition',
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
            mirrorRelationship: 'acquisitionProcessDefinitions',
            singular: false,
        },
    ],
})

module.exports = AcquisitionProcessDefinition;
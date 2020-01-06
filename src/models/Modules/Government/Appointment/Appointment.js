/* 
 Class Model: Appointment
 SuperClass: Position Acquisition Process
 Description: Represents an Appointment for a particular Government Position. Has relationships to the Appointer, and the Appointee
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

const Appointment = new ClassModel({
    className: 'Appointment',
    superClasses: [PositionAcquisitionProcess],
    attributes: [
        {
            name: 'appointmentDate',
            type: Date,
        },
        {
            name: 'positionStartDate',
            type: Date,
        },
    ],
    relationships: [
        {
            name: 'appointer',
            toClass: 'Appointer',
            mirrorRelationship: 'appointments',
            singular: true,
            required: true,
        },
        {
            name: 'appointee',
            toClass: 'Appointee',
            mirrorRelationship: 'appointments',
            singular: true,
            required: true,
        },
    ],
    validations: [
        function() {
            if (this.positionStartDate < this.appointmentDate) {
                throw new NoommanValidationError('Term Start Date must be greater than or equal to Appointment Date.');
            }
        },
    ],
});

module.exports = Appointment;


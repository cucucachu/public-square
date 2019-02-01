/* 
 Class Model
 Model: Appointment
 SuperClass: Position Acquisition Process
 Description: Represents an Appointment for a particular Government Position. Has relationships to the Appointer, and the Appointee
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

var Appointment = new ClassModel({
    className = 'Appointment',
    superClasses: [PositionAcquisitionProcess],
    schema: {
        appointmentDate: {
            type: Date
        },
        positionStartDate: {
            type: Date,
            validate: {
                validator: function(value) {
                    if (value < this.appointmentDate)
                        return false;
                    return true;
                },
                message: 'Term Start Date must be greater than or equal to Appointment Date.'
            }
        },
        appointer: {
            type: Schema.Types.ObjectId,
            ref: 'Appointer',
            required: true
        },
        appointee: {
            type: Schema.Types.ObjectId,
            ref: 'Appointee',
            required: true
        }
    }
});

module.exports = Appointment;


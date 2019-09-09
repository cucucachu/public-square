/* 
 Class Model
 Model: Acquisition Process Definition
 Description: Describes how a Government Position becomes filled. Some examples might be Direct Election, Indirect Election (like electoral
    college), Appointment, Appointment with Confirmation, etc. The Acquisition Process Definition for a particular Position Details will grant 
    functionality to a Government Position. For example, if a Position has a Acquisition Process of Appointment with Confirmation, then a its 
    Government Position will have a relationship to a Appointment Position Acquisition Process. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var AcquisitionProcessDefinition = new ClassModel({
    className: 'AcquisitionProcessDefinition',
	accessControlled: false,
	updateControlled: false,
    schema: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        positionDefinitions: {
            type: [Schema.Types.ObjectId],
            ref: 'PositionDefinition'
        }
    }
})

module.exports = AcquisitionProcessDefinition;
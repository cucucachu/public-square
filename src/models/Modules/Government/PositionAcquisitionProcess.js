/* 
 Class Model
 Model: Position Acquisition Process
 Description: An abstract superclass which describes how an offical attempts to get a Government Position. Two examples of the subclasses are
    Election and Appointment. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PositionAcquisitionProcess = new ClassModel({
	className: 'PositionAcquisitionProcess',
	accessControlled: false,
	abstract: true,
	schema: {
		governmentPosition: {
			type: Schema.Types.ObjectId,
			ref: 'GovernmentPosition',
			required: true
		}
	}
});

module.exports = PositionAcquisitionProcess;
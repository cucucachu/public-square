/* 
 Class Model
 Model: Appointee
 Super Class: Person Role
 Description: A Person Role which connects a Person to Appointments.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PersonRole = require('../../User/PersonRole');

var Appointee = new ClassModel({
	className: 'Appointee',
	discriminatorSuperClass: PersonRole,
	accessControlled: false,
	schema: {
		appointments: {
			type: [Schema.Types.ObjectId],
			ref: 'Appointment',
			required: true
		}
	}
});

module.exports = Appointee;

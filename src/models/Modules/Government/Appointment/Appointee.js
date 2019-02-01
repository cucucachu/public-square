/* 
 Class Model
 Model: Appointee
 Super Class: User Role
 Description: A User Role which connects a Person to Appointments.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var UserRole = require('../../User/UserRole');

var Appointee = new ClassModel({
	className: 'Appointee',
	discriminatorSuperClass: UserRole,
	schema: {
		appointments: {
			type: [Schema.Types.ObjectId],
			ref: 'Appointment',
			required: true
		}
	}
});

module.exports = Appointee;

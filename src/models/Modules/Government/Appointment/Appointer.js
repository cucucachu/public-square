/* 
 Class Model
 Model: Appointer
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Appointment of a person to a Government Position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Appointer = new ClassModel({
	className: 'Appointer',
	superClasses: [GovernmentRole],
	accessControlled: false,
	schema: {
		appointments: {
			type: [Schema.Types.ObjectId],
			ref: 'Appointment'
		}
	}
});

module.exports = Appointer;

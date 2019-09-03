/* 
 Class Model
 Model: Government Official
 Description: A User Role connecting a Person to Occupied Positions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var GovernmentOfficial = new ClassModel({
	className: 'GovernmentOfficial',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		occupiedPositions: {
			type: [Schema.Types.ObjectId],
			ref: 'OccupiedPosition',
		}
	}
})

module.exports = GovernmentOfficial;
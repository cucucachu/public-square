/* 
 Class Model
 Model: Government Official
 Description: A Person Role connecting a Person to Occupied Positions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PersonRole = require('../User/PersonRole');

var GovernmentOfficial = new ClassModel({
	className: 'GovernmentOfficial',
	discriminatorSuperClass: PersonRole,
	accessControlled: false,
	updateControlled: false,
	schema: {
		occupiedPositions: {
			type: [Schema.Types.ObjectId],
			ref: 'OccupiedPosition',
		}
	}
})

module.exports = GovernmentOfficial;
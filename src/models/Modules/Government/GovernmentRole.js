/* 
 Class Model
 Model: Government Role
 Abstract
 Description: A abstract super class connecting an Occupied Position to different classes that enable functionallity based on the Government Powers
    for the Government Position. Subclasses include Executive, Judge, Legislator, Nominator, and Confirmer.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GovernmentRole = new ClassModel({
	className: 'GovernmentRole',
	abstract: true,
	schema: {
		occupiedPosition: {
			type: Schema.Types.ObjectId,
			ref: 'OccupiedPosition',
			required: true
		}
	}
});

module.exports = GovernmentRole;
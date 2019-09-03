/* 
 Class model
 Model: Stamper
 Discriminated Super Class: User Role
 Description: Relates a User to a UserPost that they have stamp they have assigned to a User Post.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var Stamper = new ClassModel({
	className: 'Stamper',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		stamps: 
		{
			type: [Schema.Types.ObjectId],
			ref: 'Stamp',
			required: true
		}
	}
});

module.exports = Stamper;

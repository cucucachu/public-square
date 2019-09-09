/* 
 Class Model
 Model: Poster
 Discriminated Super Class: User Role
 Description: Links a User to a Post they have made.
 Super Class: User Role
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var Poster = new ClassModel({
	className: 'Poster',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		userPosts: 
		{
			type: [Schema.Types.ObjectId],
			ref: 'UserPost',
			required: true,
			owns: true
		}
	}
});

module.exports = Poster;

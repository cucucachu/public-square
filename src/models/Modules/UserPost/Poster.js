/* 
 Class Model: Poster
 Discriminated Super Class: User Role
 Description: Links a User to a Post they have made.
 Super Class: User Role
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const Poster = new ClassModel({
	className: 'Poster',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'userPosts',
			toClass: 'UserPost',
			mirrorRelationship: 'poster',
			singular: false,
			required: true,
			owns: true,
		},
	],
});

module.exports = Poster;

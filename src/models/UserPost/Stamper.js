/* 
 Class Model: Stamper
 Discriminated Super Class: User Role
 Description: Relates a User to a UserPost that they have stamp they have assigned to a User Post.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const Stamper = new ClassModel({
	className: 'Stamper',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'stamps',
			toClass: 'Stamp',
			mirrorRelationship: 'stamper',
			singular: false,
			requried: true,
		},
	],
});

module.exports = Stamper;

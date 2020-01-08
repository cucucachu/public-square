/* 
 Class Model: Stamp
 Description: A stamp represents a user marking a User Post as either good or bad.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Stamp = new ClassModel({
	className: 'Stamp',
	attributes: [
		{
			name: 'comment',
			type: String,
		},
		{
			name: 'stampDate',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'stamper',
			toClass: 'Stamper',
			mirrorRelationship: 'stamps',
			singular: true,
			required: true,
		},
		{
			name: 'userPost',
			toClass: 'UserPost',
			mirrorRelationship: 'stamps',
			singular: true,
			required: true,
		},
		{
			name: 'stampType',
			toClass: 'StampType',
			singular: true,
			required: true,
		},
	],
});

module.exports = Stamp;

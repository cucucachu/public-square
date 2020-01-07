/* 
 Class Model: Stamp Type
 Abstract
 Discriminator Sub Classes: Approval Stampt Type, Objection Stamp Type
 Description: A particular stamp a User wishes to assign to a User Post.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const StampType = new ClassModel({
	className: 'StampType',
	abstract: true,
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
		{
			name: 'description',
			type: String,
			required: true,
		},
		{
			name: 'weight',
			type: Number,
			required: true,
		},
	],
});

module.exports = StampType;

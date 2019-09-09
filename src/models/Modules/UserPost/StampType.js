/* 
 Class Model
 Model: Stamp Type
 Abstract
 Discriminator Sub Classes: Approval Stampt Type, Objection Stamp Type
 Description: A particular stamp a User wishes to assign to a User Post.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var StampType = new ClassModel({
	className: 'StampType',
	accessControlled: false,
	updateControlled: false,
	discriminated: true,
	abstract: true,
	schema: {
		_id: Schema.Types.ObjectId,
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		weight: {
			type: Number,
			required: true
		}
	}
});

module.exports = StampType;

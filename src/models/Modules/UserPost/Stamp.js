/* 
 Mongoose Schema and Model Functions
 Model: Stamp
 Description: A stamp represents a user marking a User Post as either good or bad.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Stamp = new ClassModel({
	className: 'Stamp',
	accessControlled: false,
	schema: {
		_id: Schema.Types.ObjectId,
		comment: {
			type: String
		},
		stampDate: {
			type: Date,
			required: true
		},
		stamper: {
			type: Schema.Types.ObjectId,
			ref: 'Poster',
			required: true
		},
		userPost: {
			type: Schema.Types.ObjectId,
			ref: 'UserPost',
			required: true
		},
		stampType: {
			type: Schema.Types.ObjectId,
			ref: 'StampType',
			required: true
		}
	}
});

module.exports = Stamp;

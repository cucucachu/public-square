/* 
 Class Model
 Model: Post Stream
 Description: A collection of User Posts for a particular Postable instance.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PostStream = new ClassModel({
	className: 'PostStream',
	accessControlled: false,
	schema: {
		_id: Schema.Types.ObjectId,
		userGroup: {
			type: Schema.Types.ObjectId,
			ref: 'UserGroup',
			required: true
		},
		userPosts: {
			type: [Schema.Types.ObjectId],
			ref: 'UserPost',
			required: true
		}
	}
});

module.exports = PostStream;

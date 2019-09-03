/* 
 Class Model
 Model: User Post
 Description: A submission of text and external links that a User wishes to Post to a particular Post Stream.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserPost = new ClassModel({
	className: 'UserPost',
	accessControlled: false,
	schema: {
		_id: Schema.Types.ObjectId,
		textContent: {
			type: String,
			required: true
		},
		postDate: {
			type: Date,
			required: true
		},
		poster: {
			type: Schema.Types.ObjectId,
			ref: 'Poster',
			required: true
		},
		postStream: {
			type: Schema.Types.ObjectId,
			ref: 'PostStream',
			required: true
		},
		parentUserPost: {
			type: Schema.Types.ObjectId,
			ref: 'UserPost'
		},
		childUserPosts: {
			type: [Schema.Types.ObjectId],
			ref: 'UserPost'
		},
		stamps: {
			type: [Schema.Types.ObjectId],
			ref: 'Stamp'
		},
		externalLinks: {
			type: [Schema.Types.ObjectId],
			ref: 'ExternalLink'
		}
	}
});

module.exports = UserPost;

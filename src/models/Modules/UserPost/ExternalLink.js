/* 
 Class Model
 Discriminated Sub Classes: ArticleLink, ImageLink, VideoLink
 Model: External Link
 Description: A link to an external web page.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var ExternalLink = new ClassModel({
	className: 'ExternalLink',
	discriminated: true,
	schema: {
		_id: Schema.Types.ObjectId,
		createdAt: {
			type: Date,
			required: true
		},
		url: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		userPosts: {
			type: [Schema.Types.ObjectId],
			ref: 'UserPost',
		}
	}
});

module.exports = ExternalLink;

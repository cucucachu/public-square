/* 
 Class Model: Post Stream
 Description: A collection of User Posts for a particular Postable instance.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PostStream = new ClassModel({
	className: 'PostStream',
	relationships: [
		{
			name: 'userGroup',
			toClass: 'UserGroup',
			mirrorRelationship: 'postStream',
			singular: true,
			required: true,
		},
		{
			name: 'userPosts',
			toClass: 'UserPost',
			mirrorRelationship: 'postStream',
			singular: false,
			required: true,
		},
	],
});

module.exports = PostStream;

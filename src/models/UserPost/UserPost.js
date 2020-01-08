/* 
 Class Model: User Post
 Description: A submission of text and external links that a User wishes to Post to a particular Post Stream.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserPost = new ClassModel({
	className: 'UserPost',
	attributes: [
		{
			name: 'textContent',
			type: String,
			required: true,
		},
		{
			name: 'postDate',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'poster',
			toClass: 'Poster',
			mirrorRelationship: 'userPosts',
			singular: true,
			required: true,
		},
		{
			name: 'postStream',
			toClass: 'PostStream',
			mirrorRelationship: 'userPosts',
			singular: true,
			required: true,
		},
		{
			name: 'parentUserPost',
			toClass: 'UserPost',
			mirrorRelationship: 'childUserPosts',
			singular: true,
		},
		{
			name: 'childUserPosts',
			toClass: 'UserPost',
			mirrorRelationship: 'parentUserPost',
			singular: false,
		},
		{
			name: 'stamps',
			toClass: 'Stamp',
			mirrorRelationship: 'userPost',
			singular: false,
		},
		{
			name: 'externalLinks',
			toClass: 'ExternalLink',
			mirrorRelationship: 'userPosts',
			singular: false,
		},
	],
});

module.exports = UserPost;

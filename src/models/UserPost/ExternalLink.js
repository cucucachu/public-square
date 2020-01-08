/* 
 Class Model: External Link
 Discriminated Sub Classes: ArticleLink, ImageLink, VideoLink
 Description: A link to an external web page.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExternalLink = new ClassModel({
	className: 'ExternalLink',
	attributes: [
		{
			name: 'createdAt',
			type: Date,
			required: true,
		},
		{
			name: 'url',
			type: String,
			required: true,
		},
		{
			name: 'text',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'userPosts',
			toClass: 'UserPost',
			mirrorRelationship: 'externalLinks',
			singular: false,
		}
	],
});

module.exports = ExternalLink;

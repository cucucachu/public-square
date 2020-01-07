/* 
 Class Model: Article Link
 Discriminated Super Class: External Link
 Description: A link to an external news article.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExternalLink = require('./ExternalLink');

const ArticleLink = new ClassModel({
	className: 'ArticleLink',
	superClasses: [ExternalLink],
	useSuperClassCollection: true,
});

module.exports = ArticleLink;

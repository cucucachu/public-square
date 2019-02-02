/* 
 Class Model
 Discriminated Super Class: External Link
 Model: Article Link
 Description: A link to an external news article.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var ExternalLink = require('./ExternalLink');

var ArticleLink = new ClassModel({
	className: 'ArticleLink',
	discriminatorSuperClass: ExternalLink,
	schema: {}
});

module.exports = ArticleLink;

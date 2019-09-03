/* 
 Class Model
 Discriminated Super Class: External Link
 Model: Video Link
 Description: A link to an external image.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var ExternalLink = require('./ExternalLink');

var VideoLink = new ClassModel({
	className: 'VideoLink',
	accessControlled: false,
	discriminatorSuperClass: ExternalLink,
	schema: {}
});

module.exports = VideoLink;

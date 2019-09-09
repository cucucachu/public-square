/* 
 Class Model
 Discriminated Super Class: External Link
 Model: Image Link
 Description: A link to an external image.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var ExternalLink = require('./ExternalLink');

var ImageLink = new ClassModel({
	className: 'ImageLink',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: ExternalLink,
	schema: {}
});

module.exports = ImageLink;

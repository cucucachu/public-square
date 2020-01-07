/* 
 Class Model: Image Link
 Discriminated Super Class: External Link
 Description: A link to an external image.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExternalLink = require('./ExternalLink');

const ImageLink = new ClassModel({
	className: 'ImageLink',
	superClasses: [ExternalLink],
	useSuperClassCollection: true,
});

module.exports = ImageLink;

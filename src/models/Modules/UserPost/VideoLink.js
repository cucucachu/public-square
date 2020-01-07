/* 
 Class Model: Video Link
 Discriminated Super Class: External Link
 Description: A link to an external image.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExternalLink = require('./ExternalLink');

const VideoLink = new ClassModel({
	className: 'VideoLink',
	superClasses: [ExternalLink],
	useSuperClassCollection: true,
});

module.exports = VideoLink;

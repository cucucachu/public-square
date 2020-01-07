/* 
 Class Model: Objection Stamp Type
 Discriminated Super Class: Stamp Type
 Description: A subclass of Stamp Type which is positive.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const StampType = require('./StampType');

const ObjectionStampType = new ClassModel({
	className: 'ObjectionStampType',
	superClasses: [StampType],
	useSuperClassCollection: true,
})

module.exports = ObjectionStampType;

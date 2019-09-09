/* 
 Class Model
 Discriminated Super Class: Stamp Type
 Model: Objection Stamp Type
 Description: A subclass of Stamp Type which is positive.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var StampType = require('./StampType');

var ObjectionStampType = new ClassModel({
	className: 'ObjectionStampType',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: StampType,
	schema: {}
})

module.exports = ObjectionStampType;

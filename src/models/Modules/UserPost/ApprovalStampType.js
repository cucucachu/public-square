/* 
 Class Model
 Discriminated Super Class: Stamp Type
 Model: Approval Stamp Type
 Description: A subclass of Stamp Type which is positive.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var StampType = require('./StampType');

var ApprovalStampType = new ClassModel({
	className: 'ApprovalStampType',
	discriminatorSuperClass: StampType,
	schema: {}
})

module.exports = ApprovalStampType;

/* 
 Class Model
 Model: Group Event
 Super Class(es): UserGroup
 Description: A subclass of a UserGroup with a address, start date, and end date.  
*/

var ClassModel = require('../../ClassModel');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserGroup = require('./UserGroup');

var GroupEvent = new ClassModel({
    className: 'GroupEvent',
	accessControlled: false,
    superClasses: [UserGroup],
    schema: {
        startTime : {
            type : Date,
            required : true
        },
        endTime : {
            type : Date,
            required : true
        },
        addresses: {
            type: [Schema.Types.ObjectId],
            ref: 'Address',
            requried: true
        }
    }
})

module.exports = GroupEvent;
/* 
 Mongoose Schema and Model Functions
 Model: User Group
 Sub Classes: Group Event, Organization
 Description: Definies a group of users, which has members and managers, and which has an associated Post Stream.  
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');


var UserGroup = new ClassModel({
	className: 'UserGroup',
	schema: {
		_id: Schema.Types.ObjectId,
		name: {
			type: String,
			required: true
		},
        createdAt : {
            type : Date, 
            required : true
        },
		endDate: Date,
		parentGroup: {
			type: Schema.Types.ObjectId,
			ref: 'UserGroup'
		},
		childGroups: {
			type: [Schema.Types.ObjectId],
			ref: 'UserGroup'
		},
		groupManagers: {
			type: [Schema.Types.ObjectId],
			ref: 'GroupManager',
			required: true
		},
		groupMembers: {
			type: [Schema.Types.ObjectId],
			ref: 'GroupMember'
		}
	}
});

module.exports = UserGroup;

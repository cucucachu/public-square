// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Models
var GroupMember = require('./GroupMember');
var GroupManager = require('./GroupManager');

// Schema and Model Setup
var userGroupSchema = new Schema({
	_id: Schema.Types.ObjectId,
	startDate: {
		type: Date,
		required: true
	},
	endDate: Date,
	parentGroup: {
		type: Schema.Types.ObjectId,
		ref: 'UserGroup'
	},
	childGroups:
	{
		type: [Schema.Types.ObjectId],
		ref: 'UserGroup'
	},
	groupManagers:
	{
		type: [Schema.Types.ObjectId],
		ref: 'GroupManager',
		validate: function(array) {
			if (array == null || array.length == 0)
				return false;

			for (var i = 0; i < array.length; i++)
				if(/^[a-f\d]{24}$/i.test(array[i]) == false) {
					return false;
				}
		}
	},
	groupMembers: {
		type: [Schema.Types.ObjectId],
		ref: 'GroupMember'
	}
});

var UserGroup = mongoose.model('UserGroup', userGroupSchema);



//Methods 

// Create Method
var create = function() {
	return new UserGroup({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(userGroup, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		userGroup.save(function(err, savedUserGroup) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(userGroup);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(userGroup1, userGroup2) {
	match = true;
	message = '';

	if (userGroup1.startDate != userGroup2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + userGroup1.startDate +' != ' + userGroup2.startDate + '\n';
	}

	if (userGroup1.endDate != userGroup2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + userGroup1.endDate +' != ' + userGroup2.endDate + '\n';
	}
	
	if (userGroup1.groupMembers != null && userGroup2.groupMembers != null) {
		if (userGroup1.groupMembers.length != userGroup2.groupMembers.length) {
			usersMatch = false;
			message += "User Roles do not match. \n";
		}
		else {
			for (var i = 0; i < userGroup1.groupMembers.length; i++) {
				if (userGroup1.groupMembers[i] != userGroup2.groupMembers[i]) {
					usersMatch = false;
					message += "User Roles do not match. \n";

				}
			}
		}
	}
	
	if (userGroup1.groupManagers != null && userGroup2.groupManagers != null) {
		if (userGroup1.groupManagers.length != userGroup2.groupManagers.length) {
			usersMatch = false;
			message += "User Roles do not match. \n";
		}
		else {
			for (var i = 0; i < userGroup1.groupManagers.length; i++) {
				if (userGroup1.groupManagers[i] != userGroup2.groupManagers[i]) {
					usersMatch = false;
					message += "User Roles do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'User Groups Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		UserGroup.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}


// Exports
exports.Model = UserGroup;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;
/* 
 Mongoose Schema and Model Functions
 Model: Group Manager
 Description: A user Role which grants management priviliges to a User for a particular User Group.  
 Super Class: UserRole
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var UserRole = require('../User/UserRole');

// Schema and Model Setup
var GroupManagerSchema = new Schema({
	userGroup: {
		type: Schema.Types.ObjectId,
		ref: 'UserGoup',
		required: true
	}
});

var GroupManager = UserRole.Model.discriminator('GroupManager', GroupManagerSchema);

//Methods 

// Create Method
var create = function() {
	return new GroupManager({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(groupManager, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		groupManager.save(function(err, savedGroupManager) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(groupManager);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(groupManager1, groupManager2) {
	match = true;
	message = '';
	
	if (groupManager1.group != groupManager2.group){
		match = false;
		message += 'UserGroups do not match. ' + groupManager1.group +' != ' + groupManager2.group + '\n';
	}
	
	if (groupManager1.user != groupManager2.user){
		match = false;
		message += 'Users do not match. ' + groupManager1.user +' != ' + groupManager2.user + '\n';
	}

	if (groupManager1.startDate != groupManager2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + groupManager1.startDate +' != ' + groupManager2.startDate + '\n';
	}

	if (groupManager1.endDate != groupManager2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + groupManager1.endDate +' != ' + groupManager2.endDate + '\n';
	}
	
	if (match)
		message = 'Group Managers Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GroupManager.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GroupManager;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


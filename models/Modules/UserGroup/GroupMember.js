// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Models
var User = require('../User/User');
var UserRole = require('../User/UserRole');
var UserGroup = require('./UserGroup');

// Schema and Model Setup
var GroupMemberSchema = new Schema({
	userGroup: {
		type: Schema.Types.ObjectId,
		ref: 'UserGoup',
		required: true
	}
});

var GroupMember = UserRole.Model.discriminator('GroupMember', GroupMemberSchema);

//Methods 

// Create Method
var create = function() {
	return new GroupMember({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(groupMember, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		groupMember.save(function(err, savedGroupMember) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(groupMember);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(groupMember1, groupMember2) {
	match = true;
	message = '';
	
	if (groupMember1.group != groupMember2.group){
		match = false;
		message += 'Users do not match. ' + groupMember1.group +' != ' + groupMember2.group + '\n';
	}

	if (groupMember1.startDate != groupMember2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + groupMember1.startDate +' != ' + groupMember2.startDate + '\n';
	}

	if (groupMember1.endDate != groupMember2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + groupMember1.endDate +' != ' + groupMember2.endDate + '\n';
	}
	
	if (match)
		message = 'User Roles Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GroupMember.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GroupMember;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;
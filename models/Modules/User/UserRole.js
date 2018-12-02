// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Models
var User = require('./User');

// Schema and Model Setup
var userRoleSchema = new Schema({
	_id: Schema.Types.ObjectId,
	startDate: {
		type: Date,
		required: true
	},
	endDate: Date,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

var UserRole = mongoose.model('UserRole', userRoleSchema);


//Methods 

// Create Method
var create = function() {
	return new UserRole({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(userRole, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		userRole.save(function(err, savedUserRole){
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(userRole);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(userRole1, userRole2) {
	match = true;
	message = '';
	
	if (userRole1.user != userRole2.user){
		match = false;
		message += 'Users do not match. ' + userRole1.user +' != ' + userRole2.user + '\n';
	}

	if (userRole1.startDate != userRole2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + userRole1.startDate +' != ' + userRole2.startDate + '\n';
	}

	if (userRole1.endDate != userRole2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + userRole1.endDate +' != ' + userRole2.endDate + '\n';
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
		UserRole.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports
exports.Model = UserRole;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

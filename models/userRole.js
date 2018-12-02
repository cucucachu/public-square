// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('./database');
var Schema = mongoose.Schema;

// Related Models
var UserModel = require('./user');

// Schema and Model Setup
var userRoleSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

var UserRole = mongoose.model('UserRole', userRoleSchema);


//Methods 

// Create Method
var createUserRole = function() {
	return new UserRole({
		_id: new mongoose.Types.ObjectId()
	});
}

// Save
var saveUserRole = function(userRole, errorMessage, successMessasge){
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
var compareUserRoles = function(userRole1, userRole2) {
	match = true;
	message = '';
	
	if (userRole1.user != userRole2.user){
		match = false;
		message += 'Users do not match. ' + userRole1.user +' != ' + userRole2.user + '\n';
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
exports.UserRole = UserRole;
exports.createUserRole = createUserRole;
exports.saveUserRole = saveUserRole;
exports.compareUserRoles = compareUserRoles;
exports.clear = clear;



// Exports
exports.UserRole = UserRole;
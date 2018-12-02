// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('./database').database;
var Schema = mongoose.Schema;

var UserAccountModel = require('./userAccount');


// Schema and Model Setup
var userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	firstName: {
		type: String,
		required: true
	},
	middleName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	userAccount: {
		type: Schema.Types.ObjectId, 
		ref: 'UserAccount',
		required: true
	}
	//userRoles: [{type: Schema.Types.ObjectId, ref: 'UserRoles'}]
});

var User = mongoose.model('User', userSchema);

// Methods

// Create Methods 
var createUser = function() {
	return new User({
		_id: new mongoose.Types.ObjectId()
	}); 
}

// Save
var saveUser = function(user, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		user.save(function(err, newUser){
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);

				// console.error(err);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(user);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. to separate instances can be equal if their members are equal.
var compareUsers = function(user1, user2) {
	usersMatch = true;
	message = '';

	if (user1.firstName != user2.firstName) {
		usersMatch = false;
		message += 'First names do not match. ' + user1.firstName +' != ' + user2.firstName + '\n';
	}
	
	if (user1.middleName != user2.middleName) {
		usersMatch = false;
		message += 'Middle names do not match. ' + user1.middleName +' != ' + user2.middleName + '\n';
	}
	
	if (user1.lastName != user2.lastName) {
		usersMatch = false;
		message += 'Last names do not match. ' + user1.lastName +' != ' + user2.lastName + '\n';
	}
	
	if (user1.userAccount != user2.userAccount){
		usersMatch = false;
		message += 'User Accounts do not match. ' + user1.userAccount +' != ' + user2.userAccount + '\n';
	}

	if (user1.userRoles != null && user2.userRoles != null) {
		if (user1.userRoles.length != user2.userRoles.length) {
			usersMatch = false;
			message += "User Roles do not match. \n";
		}
		else {
			for (var i = 0; i < user1.userRolse.length; i++) {
				if (user1.userRoles[i] != user2.userRoles[i]) {
					usersMatch = false;
					message += "User Roles do not match. \n";

				}
			}
		}
	}
	
	if (usersMatch)
		message = 'Users Match';

	return {
		match: usersMatch, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		User.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

//Module Exports
exports.User = User;
exports.createUser = createUser;
exports.saveUser = saveUser;
exports.compareUsers = compareUsers;
exports.clear = clear;
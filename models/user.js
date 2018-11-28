// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('./database').database;
var Schema = mongoose.Schema;


// Schema and Model Setup
var userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	firstName: String,
	middleName: String,
	lastName: String,
	//userAccount: {type: Schema.Types.ObjectId, ref: 'UserAccount'},
	//userRoles: [{type: Schema.Types.ObjectId, ref: 'UserRoles'}]
});

var User = mongoose.model('User', userSchema);

// Save
var saveUser = function(user, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		user.save(function(err, newUser){
			if (err) {
				if (errorMessage != null)
					console.log(errorMessage);
				console.error(err);
				reject(err);
			}
			else {
				if (successMessasge != null)
					console.log(successMessasge);
				resolve(user);
			}
		});
	});
}

// Create Methods 
var createUser = function() {
	return new User({
		_id: new mongoose.Types.ObjectId(),
	}); 
}

// Update Attribute Methods
var setUserFirstName = function(user, firstName) {
	user.firstName = firstName;

	var errorMessage = 'Error in setUserFirstName: ' + err;
	var successMessasge = 'User first name set for User ' + user._id + '.';

	saveUser(user, errorMessage, successMessasge);
}

var setUserMiddleName = function(user, middleName) {
	user.middleName = middleName;

	var errorMessage = 'Error in setUserMiddleName: ' + err;
	var successMessasge = 'User middle name set for User ' + user._id + '.';

	saveUser(user, errorMessage, successMessasge);
}

var setUserLastName = function(user, lastName) {
	user.lastName = lastName;

	var errorMessage = 'Error in setUserLastName: ' + err;
	var successMessasge = 'User last name set for User ' + user._id + '.';

	saveUser(user, errorMessage, successMessasge);
}


// Update Relationship Methods
var setUserAccount = function(user, userAccount) {
	user.userAccount = userAccount._id;

	var errorMessage = 'Error in setUserAccount: ' + err;
	var successMessasge = 'User Account set for User ' + user.firstName + '.';

	saveUser(user, errorMessage, successMessasge);
}

var setUserRoles = function(user, userRoles) {
	user.userRoles = userRoles._id;

	var errorMessage = 'Error in setUserRoles: ' + err;
	var successMessasge = 'User Roles set for User ' + user.firstName + '.';

	saveUser(user, errorMessage, successMessasge);
}

var addUserRole = function(user, userRole) {
	user.userRoles.push(userRole._id);

	var errorMessage = 'Error in addUserRole: ' + err;
	var successMessasge = 'User Role ' + userRole + ' added for User ' + user.firstName + '.';

	saveUser(user, errorMessage, successMessasge);
}

var removeUserRole = function(user, userRole) {
	user.userRoles = user.userRoles.filter(function(value, index, arr) {
		return value != userRole._id;
	});

	var errorMessage = 'Error in removeUserRole: ' + err;
	var successMessasge = 'User Role ' + userRole + ' removed for User ' + user.firstName + '.';

	saveUser(user, errorMessage, successMessasge);
}

// Retrieval Methods
var findOneUserByName = function(firstName, middleName, lastName) {

	return new Promise(function(resolve, reject) {
		if (firstName != null && middleName != null && lastName != null) {
			
		}
		else if (firstName != null && lastName != null)
			User.findOne({firstName: firstName, lastName: lastName}, function(err, user) {
				resolve(user);
			});
	});
}

// Comparison Methods
var compareUsers = function(user1, user2) {
	usersMatch = true;
	message = '';

	if (user1.firstName != user2.firstName) {
		usersMatch = false;
		message += 'First names do not match. \n';
	}
	
	if (user1.middleName != user2.middleName) {
		usersMatch = false;
		message += 'Middle names do not match. \n';
	}
	
	if (user1.lastName != user2.lastName) {
		usersMatch = false;
		message += 'Last names do not match. \n';
	}
	
	if (user1.userAccount != user2.userAccount){
		usersMatch = false;
		message += 'User Accounts do not match. \n';
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


//Module Exports
module.exports.User = User;
module.exports.createUser = createUser;
module.exports.saveUser = saveUser;
module.exports.compareUsers = compareUsers;
/* 
 Mongoose Schema and Model Functions
 Model: Poster
 Description: Links a User to a Post they have made.
 Super Class: User Role
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Model
var UserRole = require('../User/UserRole');

// Schema and Model Setup
var PosterSchema = new Schema({
	userPosts: 
	{
		type: [Schema.Types.ObjectId],
		ref: 'UserPost',
		required: true
	}
});

var Poster = UserRole.Model.discriminator('Poster', PosterSchema);

//Methods 

// Create Method
var create = function() {
	return new Poster({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(poster, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		poster.save(function(err, saved) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(saved);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(poster1, poster2) {
	match = true;
	message = '';
	
	if (poster1.user != poster2.user){
		match = false;
		message += 'Users do not match. ' + poster1.user +' != ' + poster2.user + '\n';
	}

	if (poster1.startDate != poster2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + poster1.startDate +' != ' + poster2.startDate + '\n';
	}

	if (poster1.endDate != poster2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + poster1.endDate +' != ' + poster2.endDate + '\n';
	}
	
	if (poster1.userPosts != null && poster2.userPosts != null) {
		if (poster1.userPosts.length != poster2.userPosts.length) {
			match = false;
			message += "User Posts do not match. \n";
		}
		else {
			for (var i = 0; i < poster1.userPosts.length; i++) {
				if (poster1.userPosts[i] != poster2.userPosts[i]) {
					match = false;
					message += "User Posts do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Posters Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Poster.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Poster;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;
/* 
 Mongoose Schema and Model Functions
 Model: User Post
 Description: A submission of text and external links that a User wishes to Post to a particular Post Stream.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Models
var Poster = require('./Poster');

// Schema and Model Setup
var UserPostSchema = new Schema({
	_id: Schema.Types.ObjectId,
	textContent: {
		type: String,
		required: true
	},
	postDate: {
		type: Date,
		required: true
	},
	poster: {
		type: Schema.Types.ObjectId,
		ref: 'Poster',
		required: true
	},
	parentUserPost: {
		type: Schema.Types.ObjectId,
		ref: 'UserPost'
	},
	childUserPosts: {
		type: [Schema.Types.ObjectId],
		ref: 'UserPost'
	}
});

var UserPost = mongoose.model('UserPost', UserPostSchema);

//Methods 

// Create Method
var create = function() {
	return new UserPost({
		_id: new mongoose.Types.ObjectId(),
		postDate: new Date()
	});
}

// Save
var save = function(userPost, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		userPost.save(function(err, saved) {
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

// Sets the relationships between userPost and poster and then saves each. Has validations to check that we are not changeing 
// the poster for an existing userpost, and that userPost and poster are both valid before calling save().
var saveUserPostAndPoster = function(userPost, poster) {
	return new Promise(function(resolve, reject) {
		var errorMessage = '';
		var error;
		
		// Validations
		if (userPost.poster != null && userPost.poster != poster._id) {
			errorMessage = 'UserPost.saveUserPostAndPoster(userPost, Poster), Error: Illegal attempt to update UserPost to a new Poster.';
		}

		if (errorMessage != '')
			reject(new Error (errorMessage));
		else {
			userPost.poster = poster._id;

			if (!(userPost._id in poster.userPosts)) {
				poster.userPosts.push(userPost._id);
			}

			error = userPost.validateSync();

			if (error)
				errorMessage += error.message;
			
			error = poster.validateSync();

			if (error)
				errorMessage += error.message;
			
			if (errorMessage != '')
				reject(new Error (errorMessage));
			else {
				save(userPost).then(
					function() {
						Poster.save(poster).then(
							function() {
								resolve(true);
							},
							function(saveError) {
								reject(saveError);
							}
						);
					},
					function(saveError) {
						reject(saveError);
					}

				);

			}

		}
	});
}


// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(userPost1, userPost2) {
	var match = true;
	var message = '';
	
	if (userPost1.poster != userPost2.poster){
		match = false;
		message += 'Posters do not match. ' + userPost1.poster +' != ' + userPost2.poster + '\n';
	}

	if (userPost1.postDate != userPost2.postDate) {
		match = false;
		message += 'Post Dates do not match. ' + userPost1.postDate +' != ' + userPost2.postDate + '\n';
	}

	if (userPost1.textContent != userPost2.textContent) {
		match = false;
		message += 'Text Contents do not match. ' + userPost1.textContent +' != ' + userPost2.textContent + '\n';
	}

	if (userPost1.parentUserPost != userPost2.parentUserPost) {
		match = false;
		message += 'Parent User Posts do not match. ' + userPost1.parentUserPost +' != ' + userPost2.parentUserPost + '\n';
	}
	
	if (userPost1.childUserPosts != null && userPost2.childUserPosts != null) {
		if (userPost1.childUserPosts.length != userPost2.childUserPosts.length) {
			match = false;
			message += "Child User Posts do not match. \n";
		}
		else {
			for (var i = 0; i < userPost1.childUserPosts.length; i++) {
				if (userPost1.childUserPosts[i] != userPost2.childUserPosts[i]) {
					match = false;
					message += "Child User Posts do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'User Posts Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		UserPost.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = UserPost;
exports.create = create;
exports.save = save;
exports.saveUserPostAndPoster = saveUserPostAndPoster;
exports.compare = compare;
exports.clear = clear;


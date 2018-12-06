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
var save = function(userPost, errorMessage, successMessasge){
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

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(userPost1, userPost2) {
	match = true;
	message = '';
	
	if (userPost1.poster != userPost2.poster){
		match = false;
		message += 'Posters do not match. ' + userPost1.group +' != ' + userPost2.group + '\n';
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
exports.compare = compare;
exports.clear = clear;


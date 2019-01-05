/* 
 Mongoose Schema and Model Functions
 Model: Post Stream
 Description: A collection of User Posts for a particular Postable instance.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var PostStreamSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userGroup: {
        type: Schema.Types.ObjectId,
        ref: 'UserGroup',
        required: true
    },
	userPosts: {
		type: [Schema.Types.ObjectId],
		ref: 'UserPost',
		required: true
	}
});

var PostStream = mongoose.model('PostStream', PostStreamSchema);

//Methods 

// Create Method
var create = function() {
	return new PostStream({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(postStream, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		postStream.save(function(err, saved) {
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
var compare = function(postStream1, postStream2) {
	var match = true;
	var message = '';
	
	if (postStream1.userGroup != postStream2.userGroup){
		match = false;
		message += 'User Groups do not match. ' + postStream1.userGroup +' != ' + postStream2.userGroup + '\n';
	}
	
	if (postStream1.userPosts != null && postStream2.userPosts != null) {
		if (postStream1.userPosts.length != postStream2.userPosts.length) {
			match = false;
			message += "User Posts do not match. \n";
		}
		else {
			for (var i = 0; i < postStream1.userPosts.length; i++) {
				if (postStream1.userPosts[i] != postStream2.userPosts[i]) {
					match = false;
					message += "User Posts do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Post Streams Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		PostStream.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PostStream;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


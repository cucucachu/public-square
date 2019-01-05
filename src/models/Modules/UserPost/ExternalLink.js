/* 
 Mongoose Schema and Model Functions
 Model: External Link
 Description: A link to an external web page.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var ExternalLinkSchema = new Schema({
    _id: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        required: true
    },
    url: {
        type: String,
        required: true
    },
	userPosts: {
		type: [Schema.Types.ObjectId],
		ref: 'UserPost',
		required: true
	}
});

var ExternalLink = mongoose.model('ExternalLink', ExternalLinkSchema);

//Methods 

// Create Method
var create = function() {
	return new ExternalLink({
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date()
	});
}

// Save
var save = function(externalLink, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		externalLink.save(function(err, saved) {
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
var compare = function(externalLink1, externalLink2) {
	var match = true;
	var message = '';
	
	if (externalLink1.url != externalLink2.url){
		match = false;
		message += 'URLs do not match. ' + externalLink1.url +' != ' + externalLink2.url + '\n';
	}
	
	if (externalLink1.userPosts != null && externalLink2.userPosts != null) {
		if (externalLink1.userPosts.length != externalLink2.userPosts.length) {
			match = false;
			message += "User Posts do not match. \n";
		}
		else {
			for (var i = 0; i < externalLink1.userPosts.length; i++) {
				if (externalLink1.userPosts[i] != externalLink2.userPosts[i]) {
					match = false;
					message += "User Posts do not match. \n";
				}
			}
		}
	}
	
	if (match)
		message = 'External Links Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ExternalLink.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ExternalLink;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;


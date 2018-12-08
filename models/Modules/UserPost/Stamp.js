// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Models
var UserPost = require('./UserPost');
var Stamper = require('./Stamper');

// Schema and Model Setup
var StampSchema = new Schema({
	_id: Schema.Types.ObjectId,
	comment: {
		type: String,
		required: true
	},
	stampDate: {
		type: Date,
		required: true
	},
	stamper: {
		type: Schema.Types.ObjectId,
		ref: 'Poster',
		required: true
    },
	userPost: {
		type: Schema.Types.ObjectId,
		ref: 'UserPost',
		required: true
    },
    stampType: {
        type: Schema.Types.ObjectId,
        ref: 'StampType',
        required: true
    }
});

var Stamp = mongoose.model('Stamp', StampSchema);

//Methods 

// Create Method
var create = function() {
	return new Stamp({
		_id: new mongoose.Types.ObjectId(),
		stampDate: new Date()
	});
}

// Save
var save = function(stamp, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		stamp.save(function(err, saved) {
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

// // Sets the relationships between stampe and poster and then saves each. Has validations to check that we are not changeing 
// // the poster for an existing userpost, and that userPost and poster are both valid before calling save().
// var saveStampAndStamper = function(stamp, stamper) {
// 	return new Promise(function(resolve, reject) {
// 		var errorMessage = '';
// 		var error;
		
// 		// Validations
// 		if (stamp.stamper != null && stamp.stamper != stamper._id) {
// 			errorMessage = 'Stamp.saveStampAndStamper(userPost, Poster), Error: Illegal attempt to update UserPost to a new Poster.';
// 		}

// 		if (errorMessage != '')
// 			reject(new Error (errorMessage));
// 		else {
// 			userPost.poster = poster._id;

// 			if (!(userPost._id in poster.userPosts)) {
// 				poster.userPosts.push(userPost._id);
// 			}

// 			error = userPost.validateSync();

// 			if (error)
// 				errorMessage += error.message;
			
// 			error = poster.validateSync();

// 			if (error)
// 				errorMessage += error.message;
			
// 			if (errorMessage != '')
// 				reject(new Error (errorMessage));
// 			else {
// 				save(userPost).then(
// 					function() {
// 						Poster.save(poster).then(
// 							function() {
// 								resolve(true);
// 							},
// 							function(saveError) {
// 								reject(saveError);
// 							}
// 						);
// 					},
// 					function(saveError) {
// 						reject(saveError);
// 					}

// 				);

// 			}

// 		}
// 	});
// }


// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(stamp1, stamp2) {
	match = true;
	message = '';
	
	if (stamp1.stamper != stamp2.stamper){
		match = false;
		message += 'Stampers do not match. ' + stamp1.stamper +' != ' + stamp2.stamper + '\n';
	}
	
	if (stamp1.userPost != stamp2.userPost){
		match = false;
		message += 'User Posts do not match. ' + stamp1.userPost +' != ' + stamp2.userPost + '\n';
	}

	if (stamp1.stampDate != stamp2.stampDate) {
		match = false;
		message += 'Stamp Dates do not match. ' + stamp1.stampDate +' != ' + stamp2.stampDate + '\n';
	}

	if (stamp1.comment != stamp2.comment) {
		match = false;
		message += 'Comments do not match. ' + stamp1.comment +' != ' + stamp2.comment + '\n';
	}

	if (stamp1.stampType != stamp2.stampType) {
		match = false;
		message += 'Stamp Types do not match. ' + stamp1.stampType +' != ' + stamp2.stampType + '\n';
	}
	
	if (match)
		message = 'Stamps Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Stamp.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Stamp;
exports.create = create;
exports.save = save;
//exports.saveUserPostAndPoster = saveUserPostAndPoster;
exports.compare = compare;
exports.clear = clear;


// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Related Model
var UserRole = require('../User/UserRole');
var Stamp = require('./Stamp');

// Schema and Model Setup
var StamperSchema = new Schema({
	stamps: 
	{
		type: [Schema.Types.ObjectId],
		ref: 'Stamp',
		required: true
	}
});

var Stamper = UserRole.Model.discriminator('Stamper', StamperSchema);

//Methods 

// Create Method
var create = function() {
	return new Stamper({
		_id: new mongoose.Types.ObjectId(),
		startDate: new Date()
	});
}

// Save
var save = function(stamper, errorMessage, successMessasge){
	return new Promise(function(resolve, reject) {
		stamper.save(function(err, saved) {
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
var compare = function(stamper1, stamper2) {
	match = true;
	message = '';
	
	if (stamper1.user != stamper2.user){
		match = false;
		message += 'Users do not match. ' + stamper1.user +' != ' + stamper2.user + '\n';
	}

	if (stamper1.startDate != stamper2.startDate) {
		match = false;
		message += 'Start Dates do not match. ' + stamper1.startDate +' != ' + stamper2.startDate + '\n';
	}

	if (stamper1.endDate != stamper2.endDate) {
		match = false;
		message += 'End Dates do not match. ' + stamper1.endDate +' != ' + stamper2.endDate + '\n';
	}
	
	if (stamper1.stamps != null && stamper2.stamps != null) {
		if (stamper1.stamps.length != stamper2.stamps.length) {
			match = false;
			message += "Stamps do not match. \n";
		}
		else {
			for (var i = 0; i < stamper1.stamps.length; i++) {
				if (stamper1.stamps[i] != stamper2.stamps[i]) {
					match = false;
					message += "Stamps do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Stampers Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Stamper.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Stamper;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;
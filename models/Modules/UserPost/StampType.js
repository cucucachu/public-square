// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var StampTypeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
});

var StampType = mongoose.model('StampType', StampTypeSchema);


// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(stampType1, stampType2) {
	match = true;
	message = '';
	
	if (stampType1.name != stampType2.name) {
		match = false;
		message += 'Names do not match. ' + stampType1.name +' != ' + stampType2.name + '\n';
	}
	
	if (stampType1.description != stampType2.description) {
		match = false;
		message += 'Descriptions do not match. ' + stampType1.description +' != ' + stampType2.description + '\n';
	}
	
	if (stampType1.weight != stampType2.weight) {
		match = false;
		message += 'Weights do not match. ' + stampType1.weight +' != ' + stampType2.weight + '\n';
	}
	
	if (match)
		message = 'Stamps Types Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		StampType.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = StampType;
exports.compare = compare;
exports.clear = clear;


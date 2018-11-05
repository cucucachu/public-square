// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('./database');


// Schema and Model Setup
var userSchema = new mongoose.Schema({
	name: String
});

var User = mongoose.model('User', userSchema);



//Methods 
var saveUser = function(name) {
	var db = database.connect();
	var newUser = new User({ name: name }); 
	newUser.save(function (err, bob) {
		if (err){
			console.log('Error in saving.');
			return console.error(err);
		}
		else 
			console.log('New User ' + name + ' saved');
		database.close(db);
	});
}

//Module Exports
module.exports.saveUser = saveUser;
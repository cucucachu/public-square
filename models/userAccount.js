// // MongoDB and Mongoose Setup
// var mongoose = require('mongoose');
// var database = require('./database');
// var Schema = mongoose.Schema;

// // Schema and Model Setup
// var userAccountSchema = new Schema({
// 	_id: Schema.Types.ObjectID,
// 	email: String,
// 	password: String,
// 	user: { type: Schema.Types.ObjectID, ref: 'User'}
// });

// var User = mongoose.model('User', userSchema);

// //Methods 
// var saveUser = function(name) {
// 	var db = database.connect();
// 	var newUser = new User({ name: name }); 
// 	newUser.save(function (err, bob) {
// 		if (err){
// 			console.log('Error in saving.');
// 			return console.error(err);
// 		}
// 		else 
// 			console.log('New User ' + name + ' saved');
// 		database.close(db);
// 	});
// }


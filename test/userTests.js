var assert = require('assert');
var userModel = require('../models/user');

describe('User Model Tests', function() {

	describe('Class: User', function(){	
		describe('user.createUser()', function() {
		
			it('createUser creates a user object.', function() {
				var user = userModel.createUser();
				assert(typeof(user) === "object");
			});

			it('createUser creates a user object with _id field populated', function(){
				var user = userModel.createUser();
				assert(typeof(user._id) === "object" && /^[a-f\d]{24}$/i.test(user._id));
			});
		});

	});
});
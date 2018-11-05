var userModel = require('../models/user');

var createUser = function(name) {
	userModel.saveUser(name);
}

module.exports.createUser = createUser;
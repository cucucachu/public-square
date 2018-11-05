var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
	var message = "wassup";

	userController.createUser('Joe');

	res.render('index', { title: message });
});

module.exports = router;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserAccount = require('./models/Modules/User/UserAccount');
const LoginController = require('./controllers/LoginController');
const hasher = require('password-hash');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, callback) {
        UserAccount.findOne({
				email: email
			}).then(userAccount => {
				if (!userAccount) {
					callback(null, false, {message: 'Incorrect email.'});
				}
				else if (hasher.verify(password, userAccount.passwordHash) == false){
					callback(null, false, {message: 'Incorrect password.'});
				}
				else {
					callback(null, userAccount, {message: 'Logged In Successfully'});
				}
          })
          .catch(error => {
			  callback(error, false, {message: 'Error finding user account.'});
		  });
	}
	
));

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey   : jwtSecret
	},
	function (jwtPayload, callback) {
		LoginController.verifyAuthToken(jwtPayload.authToken).then(
			(authToken) => {
				callback(null, jwtPayload);
			},
			(error) => {
				callback(error);
			}
		)
	}
));
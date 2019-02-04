const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserAccount = require('./models/Modules/User/UserAccount');
const LoginController = require('./controllers/LoginController');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, callback) {
        UserAccount.findOne({
				email: email, 
				passwordHash: password
			}).then(userAccount => {
               if (!userAccount) {
                    callback(null, false, {message: 'Incorrect email or password.'});
			   }
               callback(null, userAccount, {message: 'Logged In Successfully'});
          })
          .catch(err => {
			  callback(err);
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
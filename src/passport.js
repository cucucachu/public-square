const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserAccount = require('./models/Modules/User/UserAccount');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, callback) {
		// this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        UserAccount.findOne({
				email: email, 
				passwordHash: password
			}).then(userAccount => {
               if (!userAccount) {
                    callback(null, false, {message: 'Incorrect email or password.'});
			   }
               callback(null, userAccount._id.toString(), {message: 'Logged In Successfully'});
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
	console.log('jwt payload: ' + jwtPayload);

	return UserAccount.findById(jwtPayload)
		.then(userAccount => {
			return callback(null, userAccount);
		})
		.catch(err => {
			return callback(err);
		});
}
));
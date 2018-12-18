require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./auth/model');
const authenticationWhiteList = [
	'GET /players',
	'GET /kills',
]
passport.use(new LocalStrategy({
	/*use email and password field in body to login instead*/
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done) {
		/*find a user matching the username*/
		User.findOne({ email : username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) {
		return done(null, false, { message: 'Incorrect username.' });
		}
		if (!user.isValidPassword(password)) {
		return done(null, false, { message: 'Incorrect password.' });
		}
		/*authentication successful, continue with the cb*/
		return done(null, user);
		});
	}
));
passport.use(new JWTStrategy({
	/* Use token from the Bearer Token*/
		jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey : process.env.TOKEN_SECRET
	},
	/* authenticate the JWT token */
	function (jwtPayload, cb) {
		return User.findById(jwtPayload._id)
			.then(user=> {
				return cb(null, user)
			})
			.catch(err => {
				return cb(err);
			});
	}
))

function Authenticate (request, response, next) {
	let route = `${request.method} ${request.baseUrl}`
  
	if (authenticationWhiteList.indexOf(route) !== -1) {
	  next()
	} else {
	  passport.authenticate('jwt', { session: false })(request, response, next)
	}
}

module.exports = Authenticate;
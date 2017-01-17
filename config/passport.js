var passport = require('passport');
var facebook = require('passport-facebook').Strategy;
var school = require('passport-42').Strategy;
var github = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;;
passport.use(new facebook({
	clientID: '236950966755505'
	, clientSecret: '31244054657ad23cf6556728a05d632b'
	, callbackURL: 'https://localhost:4422/login/facebook/return'
	, profileFields: ['id', 'first_name', 'picture.type(large)', 'email', 'last_name']
}, function (accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}));
passport.use(new school({
	clientID: 'fbadb86787f5e4d5d46ae4734bc3b081eaa6d848183cdd46c9ddfb8447464305'
	, clientSecret: '7c1f12c4326ceb5b1a8d1b68e50e35bcbab1023d318ce422f3782963333cf417'
	, callbackURL: "https://localhost:4422/login/42/return"
	, profileFields: {
		'id': function (obj) {
			return String(obj.id);
		}
		, 'username': 'login'
		, 'displayName': 'displayname'
		, 'name.familyName': 'last_name'
		, 'name.givenName': 'first_name'
		, 'emails.0.value': 'email'
		, 'photos.0.value': 'image_url'
	}
}, function (accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}));
passport.use(new GoogleStrategy({
	clientID: '706995370533-fn0s4ddf5ma6nbo8hp0vek2ldnctsu91.apps.googleusercontent.com'
	, clientSecret: 'wzHTRvRlfPena8Ai1llS3vef'
	, callbackURL: "https://localhost:4422/login/google/return"
	, passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}));
passport.use(new github({
	clientID: '3d87c62871a41ec20a60'
	, clientSecret: '80b88536591b3fbbe003a08f3a3462ee4d63f5bf'
	, callbackURL: "https://localhost:4422/login/github/return"
}, function (accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}));
passport.serializeUser(function (user, cb) {
	cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});
module.exports = passport;
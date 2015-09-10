'use strict';
var LocalStrategy = require('passport-local').Strategy;
var config = require('../config');
var Schema = require(config.schemaPath());

module.exports = function(passport) {


	passport.serializeUser(function(user, done) {
		done(null, {
			_id:user.id,
			name:user.userName,
			email:user.email
		});
	});


	passport.deserializeUser(function(obj, done) {
		Schema.User.findById(id, function(err, user) {
			done(err, user);
		});
	});


	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		if (email) {
			email = email.toLowerCase();
		}
		process.nextTick(function() {
			Schema.User.findOne({
				'email': email
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, 'No User Found');
				}
				if (!user.validPassword(password)) {
					return done(null, false, 'Oops! Wrong Password');
				} else {
					return done(null, user);
				}
			});
		});
	}));

	passport.use('local-signup',new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},function(req, email, password, done){
		process.nextTick(function(){
			Schema.User.findOne({'email':email}, function(err, user){
				if(err){
					return done(err);
				}
				if(user){
					return done(null, false, 'That email is already taken');
				}else{
					var newUser = new Schema.User();
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					newUser.userName = newUser.generateUsername(email);
					newUser.save(function(err){
						if(err){
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
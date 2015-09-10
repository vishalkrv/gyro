'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');

mongoose.connect(config.db_url);

var userSchema = new mongoose.Schema({
	userName:{
		type:String
	},
	password:{
		type:String
	},
	email:{
		type:String,
		index:{
			unique:true
		}
	},
	joinedOn:{
		type:Date,
		default:Date.now
	},
	lastLoggedIn:{
		type:Date,
		default:Date.now
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateUsername = function(email){
	return email.substr(0, email.lastIndexOf('@'));
};

var User = mongoose.model('User', userSchema);

module.exports = {
	User:User
};


'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	userName:String,
	password:String,
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

var postSchema = new mongoose.Schema({
	title:String,
	type:String,
	link:String,
	description:String,
	tags:[],
	comments:[],
	points:{
		type:Number,
		default: 0
	},
	by:String,
	time:{
		type:Date,
		default:Date.now
	},
	slug:{
		type:String,
		index:{
			unique:true
		}
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
var Posts = mongoose.model('Posts', postSchema);

module.exports = {
	User:User,
	Posts:Posts
};


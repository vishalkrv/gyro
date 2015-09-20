'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = Schema({
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

var tagSchema = Schema({
	name:{
		type:String,
		index:{
			unique:true
		}
	},
	createdOn:{
		type:Date,
		default:Date.now()
	}
});


var commentSchema = Schema({	
	_by:{type:Schema.Types.ObjectId, ref:'User'},
	time:{
		type:Date,
		default:Date.now
	},
	text:String
});

var postSchema = Schema({
	title:String,
	type:String,
	link:String,
	description:String,
	_tags:[{type:Schema.Types.ObjectId, ref:'Tag'}],
	_comments:[commentSchema],
	points:{
		type:Number,
		default: 0
	},
	_by:{type:Schema.Types.ObjectId, ref:'User'},
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
var Post = mongoose.model('Post', postSchema);
var Tag = mongoose.model('Tag', tagSchema);
var Comment = mongoose.model('Comment', commentSchema);
module.exports = {
	User:User,
	Post:Post,
	Tag:Tag
};


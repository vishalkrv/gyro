'use strict';

var path = require('path');
var config ={};
module.exports = config = {
	port: 8080,
	host: '127.0.0.1',
	dbUrl: 'mongodb://127.0.0.1:27017/GyroDB',
	secretKey:'thatsmyApp',
	cookieName:'Gyro_',
	root: path.normalize(path.join(__dirname, '../..')),
	serverPath: function(){
		return path.join(this.root,'/server');
	},
	clientPath: function(){
		return path.join(this.root,'/public');
	},
	routesPath: function(){
		return path.join(this.serverPath(),'/routes');
	},
	modelPath:function(){
		return path.join(this.serverPath(),'/model/');
	},
	utils:{
		isEmpty:function(obj){
			return !Object.keys(obj).length > 0;
		}
	}	
};
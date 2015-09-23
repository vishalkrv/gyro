'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var config = require('./config');
var session = require('express-session');
var StoreSession = require('connect-mongo')(session);
var mongoose = require('mongoose');
//Connect to Mongo DB
mongoose.connect(config.dbUrl);
// Passport does not directly manage your session, it only uses the session.
// So you configure session attributes (e.g. life of your session) via express
var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  store:new StoreSession({mongooseConnection:mongoose.connection}),
  resave: false, // do not automatically write to the session store
  name: config.cookieName, 
  secret: config.secretKey,
  cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
};

var app = express();

require('./strategies/local')(passport);
var routes = require(config.routesPath())(passport);

app.set('x-powered-by', false);
/*Serving static files*/
app.use(express.static(config.clientPath()));

/*Middleware Parsers*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser(config.secretKey));
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/', routes);


/*Catch 404 and and forward to error handler*/

app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res){
	res.status(err.status || 500).send({
		message: err.message,
		error:err
	});
});

module.exports = app;
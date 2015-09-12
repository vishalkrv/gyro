'use strict';

var express = require('express');
var config = require('../config');
var Schema = require(config.modelPath()+'schema');
var PostModel = require(config.modelPath()+'post');

module.exports = function(passport) {
    var router = express.Router();
    router.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info){
            if(err){
                return next(err);
            }
            if(!user){
                return  res.send(info);
            }
            req.login(user, function(err){
                if(err){
                    return next(err);
                }
                res.cookie('userName',user.userName);
                res.cookie('email',user.email);
                return res.status(200).send(user);
            });
        })(req, res, next);
    });
    router.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info){
            if(err){
                return next(err);
            }
            if(!user){
                return  res.send(info);
            }
            req.login(user, function(err){
                if(err){
                    return next(err);
                }
                res.cookie('userName',user.userName);
                res.cookie('email',user.email);
                return res.status(200).send(user);
            });
        })(req, res, next);
    });
    router.get('/logout', function(req, res) {
        req.logout();
        res.status(200).send('Hello');
    });
    router.post('/submit', function(req, res) {       
         if(req.body){
        PostModel.create(Schema.Posts, req, res);
        }else{
        res.status(200).send('Error With the JSON Object');
        }
    });
    router.post('/homeList', function(req, res) {
        if(req.body.type){            
        	res.status(200).send({
        		news:[{
                id: 1,
                points: 900,
                title: 'This is the first news title',
                by: 'Vishal Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Rahul',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }, {
                id: 2,
                points: 1000,
                title: 'This is the second news title',
                by: 'Rahul Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Vishal',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }]
        	});
        }else{
            res.status(200).send({
            news: [{
                id: 1,
                points: 100,
                title: 'This is the first news title',
                by: 'Vishal Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Rahul',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }, {
                id: 2,
                points: 200,
                title: 'This is the second news title',
                by: 'Rahul Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Vishal',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }],
            ask: [{
                id: 1,
                points: 400,
                title: 'This is the first ask title',
                by: 'India Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Rahul',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }, {
                id: 2,
                points: 500,
                title: 'This is the second ask title',
                by: 'America Kumar Verma',
                time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                comments: [{
                    by: 'Vishal',
                    time: 'Sun Aug 30 2015 11:54:00 GMT+0530 (India Standard Time)',
                    query: 'Hello, this comment is from news'
                }]
            }]
        });
        }
    });

	
    return router;
};
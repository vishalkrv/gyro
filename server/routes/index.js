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
                res.cookie(config.cookieName+'isLogged',true);
                return res.status(200).send(user);
            });
        })(req, res, next);
    });

    router.get('/user',function(req, res){
        if(req.user){
            res.status(200).send({
                userName:req.user.userName,
                email:req.user.email
            });
        }else{
            res.status(200).send('Not Authorized');
        }
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
                       res.cookie(config.cookieName+'isLogged',true);
                return res.status(200).send(user);
            });
        })(req, res, next);
    });
    router.get('/logout', function(req, res) {
        req.logout();
        res.cookie(config.cookieName+'isLogged',false);
        res.status(200).send('SuccessFully Logged Out');
    });
    router.post('/submit', function(req, res) {        
         if(req.body){
        PostModel.create(Schema.Posts, req, res);
        }else{
        res.status(200).send('Error With the JSON Object');
        }
    });
    router.post('/homeList', function(req, res) {
        console.log(req.session);
        console.log(req.user);
        if(req.body.type){            
        	PostModel.listByType(Schema.Posts, req, res);
        }else{
            PostModel.listAll(Schema.Posts, req, res);
        }
    });

	
    return router;
};
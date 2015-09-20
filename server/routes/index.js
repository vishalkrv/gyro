'use strict';
var express = require('express');
var config = require('../config');
var Schema = require(config.modelPath() + 'schema');
var PostModel = require(config.modelPath() + 'post');
module.exports = function(passport) {
    var router = express.Router();
    router.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(info);
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                res.cookie(config.cookieName + 'isLogged', true);
                return res.status(200).send({
                    _id: user._id,
                    email: user.email,
                    userName: user.userName
                });
            });
        })(req, res, next);
    });
    router.get('/user', function(req, res) {
        if (req.user) {
            res.status(200).send({
                userName: req.user.userName,
                email: req.user.email,
                _id: req.user._id
            });
        } else {
            res.status(200).send('Not Authorized');
        }
    });
    
    router.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(info);
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                res.cookie(config.cookieName + 'isLogged', true);
                return res.status(200).send({
                    _id: user._id,
                    email: user.email,
                    userName: user.userName
                });
            });
        })(req, res, next);
    });
    router.get('/logout', function(req, res) {
        req.logout();
        res.cookie(config.cookieName + 'isLogged', false);
        res.status(200).send('SuccessFully Logged Out');
    });
    router.post('/submit', function(req, res) {
        if (req.body) {
            PostModel.create(Schema.Post, req, res);
        } else {
            res.status(200).send('Error With the JSON Object');
        }
    });
    router.post('/submitTag', function(request, response) {
        if (request.body) {
            PostModel.submitTag(Schema.Tag, request, response);
        } else {
            response.status(200).send('Error With the JSON Object');
        }
    });
    router.get('/listTag', function(request, response) {
        PostModel.listTag(Schema.Tag, request, response);
    });
    router.post('/updatePoints', function(req, res) {
        if (req.body) {
            PostModel.updatePoints(Schema.Post, req, res);
        } else {
            res.status(200).send('Error With the JSON Format');
        }
    });
    router.post('/homeList', function(req, res) {        
        if (req.body.type) {
            PostModel.listByType(Schema.Post, req, res); {}
        }
        if (config.utils.isEmpty(req.body)) {
            PostModel.listAll(Schema.Post, req, res);
        }
        if(req.body.slug){
            PostModel.listOne(Schema.Post, req, res);
        }
    });

    router.post('/addComment', function(req, res){
        if(req.body.commentText && req.body.postId){
            PostModel.postComment(Schema.Post, req, res);
        }else{
            res.send(200).status('Error in Json Object');
        }
    });
    return router;
};
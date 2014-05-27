/**
 * Mondule dependencies.
 * */

var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
var Nodo = mongoose.model('Nodo');
var utils = require('../../lib/utils');
var _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId

var login = function (req, res){
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}

exports.signin = function (req, res){}

/**
 * Auth callback
 * */

exports.authCallback = login;

exports.login = function(req, res){
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    });
}

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
}

exports.logout = function (req, res){
    req.logout();
    res.redirect('/login');
}


exports.session = login;

exports.create = function(req, res){
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err){
        if(err){
            return res.render('users/signup', {
                message: req.flash('something wrong!'),
                errors: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            });
        }

        req.logIn(user, function(err){
            if(err) return next(err);
            return res.redirect('/');
        });
    });
}


/**
 *  Show profile
 * */

exports.show = function (req, res){
    var user = req.profile;
    Nodo
        .aggregate(
          [{
           $match:{
             "user":  user._id
             }
           }]
        )
        .exec(function(err, nodos){
          if(err) throw err;

          if(req.is('json')){
            res.jsonp({
              title: user.name,
              nodos:nodos,
              user: user
            })
          }else {
            res.render('users/show', {
                title: user.name,
                nodos:nodos,
                user: user
            });
          }
        });
}

/**
 *  Find user by id
 * */

exports.user = function (req, res, next, id){
    var criteria = id.match(/^[0-9a-fA-F]{24}$/) ? { _id :ObjectId(id) }:{$or:[{name:id},{username:id}]};
    User
        .findOne(criteria)
        .select('-salt -hashed_password -authToken')
        .exec(function (err, user){
            if (err) return next(err);
            if (!user) return next( new Error(' Failed to load User '+ id));
            req.profile = user;
            next();
        });
}



var express = require('express');
var app  = express();
var users = require('../controllers/users');

module.exports = function(app,passport){
    app.param('userId', users.user);

    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.get('/users/:userId', users.show);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }),
        users.session
    );
}

//    app.get('/auth/facebook',
//        passport.authenticate('facebook', {
//            scope: [ 'email', 'user_about_me'],
//            failureRedirect: '/login'
//        }), users.signin)
//    app.get('/auth/facebook/callback',
//        passport.authenticate('facebook', {
//            failureRedirect: '/login'
//        }), users.authCallback)
//    app.get('/auth/github',
//        passport.authenticate('github', {
//            failureRedirect: '/login'
//        }), users.signin)
//    app.get('/auth/github/callback',
//        passport.authenticate('github', {
//            failureRedirect: '/login'
//        }), users.authCallback)
//    app.get('/auth/twitter',
//        passport.authenticate('twitter', {
//            failureRedirect: '/login'
//        }), users.signin)
//    app.get('/auth/twitter/callback',
//        passport.authenticate('twitter', {
//            failureRedirect: '/login'
//        }), users.authCallback)
//    app.get('/auth/google',
//        passport.authenticate('google', {
//            failureRedirect: '/login',
//            scope: [
//                'https://www.googleapis.com/auth/userinfo.profile',
//                'https://www.googleapis.com/auth/userinfo.email'
//            ]
//        }), users.signin)
//    app.get('/auth/google/callback',
//        passport.authenticate('google', {
//            failureRedirect: '/login'
//        }), users.authCallback)
//    app.get('/auth/linkedin',
//        passport.authenticate('linkedin', {
//            failureRedirect: '/login',
//            scope: [
//                'r_emailaddress'
//            ]
//        }), users.signin)
//    app.get('/auth/linkedin/callback',
//        passport.authenticate('linkedin', {
//            failureRedirect: '/login'
//        }), users.authCallback)

//var app = require('../app')
//var should = require('should')
//    , request = require('supertest')
//    , agent = request(app);
////    , mongoose = require('mongoose')
////    , User = mongoose.model('User');
//var assert = require("assert")
//
//var superagent = require('superagent');
//var passportMock = require('./helpers/passport-mock');
//
///**
// *
// * req.isAuthenticated()
// *      .profile.id != req.user.id
// * req.session?
// *
// * passport.
// *             usernameField:  'email',
// *             passwordField:  'password'
// * */
//
//
//
//describe('Passport-mock Get authorized', function(){
//    var agent = superagent.agent();
//
//    before(function(done){
//        passportMock(app, {
//            passAuthentication:true,
//            email: 'email@email.com',
//            usernameField:  'email',
//            passwordField:  'password',
//            user: {
//                email: 'foobar@example.com',
//                name: 'Foo bar',
//                username: 'foobar',
//                password: 'foobar'
//            },
//            userId:1
//        });
//
//
//        request(app)
//            .get('/mock/login')
//            .end(function(err, result){
//                if(!err){
//                    //console.log(result);
//                    agent.saveCookies(result.res);
//                    done();
//
//                }else{
//
//                    done();
//
//                }
//            })
//
//    });
//
//    it('should allow access to resource', function(done){
//
//
//    });
//
//    it('should access to resource', function(done){
//        var req = request(app).get('/articles/new');
//        agent.attachCookies(req);
//        req.expect(200, done);
//    })
//});
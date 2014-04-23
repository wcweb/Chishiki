var async = require('async');

var users = require('../app/controllers/users');
var home = require('../app/controllers/home');
var nodos = require('../app/controllers/nodos');
var dashboard = require('../app/controllers/dashboard');
var auth = require('./middlewares/authorization');
var ember = require('../app/controllers/emberStatic')



/**
 * Route middlewares
 * */



module.exports = function (app, passport){


    if( process.env.NODE_ENV !== 'test'){
      var nodoAuth = [
          auth.requiresLogin,
          auth.nodo.hasAuthorization
      ];
    }else{
      var nodoAuth = [
      ];
    }

    var commentAuth = [
        auth.requiresLogin,
        auth.comment.hasAuthorization
    ];

    var role = require('./connect-roles').roles;
    require('./connect-roles')(app);

    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);

    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }),
        users.session
    );

    app.get('/users/:userId', users.show);


    app.param('userId', users.user);


    // nodo routes
    app.param('artid', nodos.load);

    // @TODO env role test.
    app.get('/nodos', nodos.index);
    if( process.env.NODE_ENV !== 'test'){
        app.get('/nodos/new', nodos.new);
        app.post('/nodos', nodos.create);
    }else{
        app.get('/nodos/new', auth.requiresLogin, nodos.new);
        app.post('/nodos', auth.requiresLogin, nodos.create);

    }

    app.get('/nodos/:artid',  nodos.show);
    app.get('/nodos/:artid/edit', nodoAuth, nodos.edit);
    app.put('/nodos/:artid', nodoAuth, nodos.update);
    app.del('/nodos/:artid', nodoAuth, nodos.destroy);


    // ember
    app.get('/demo', ember.index);
    app.get('/',home.index);

    var comments = require('../app/controllers/comments');
    app.param('commentId', comments.load);
    app.post('/nodos/:artid/comments', auth.requiresLogin, comments.create);
    app.get('/nodos/:artid/comments', auth.requiresLogin, comments.create);
    app.del('/nodos/:artid/comments/:commentId', auth.requiresLogin, comments.destroy);


    var videos = require('../app/controllers/videos');
    app.param('videoId', videos.load);
    app.post('/nodos/:artid/videos',nodoAuth, videos.create);
    app.get('/nodos/:artid/videos', nodoAuth, videos.create);
    app.del('/nodos/:artid/videos/:videoId', videos.destroy);

    var quizzes = require('../app/controllers/quizzes');
    app.param('quizId', quizzes.load);
    app.post('/nodos/:artid/quizzes',nodoAuth, quizzes.create);
    app.get('/nodos/:artid/quizzes', nodoAuth, quizzes.create);
    app.put('/nodos/:artid/quizzes/:quizId', quizzes.update);
    app.del('/nodos/:artid/quizzes/:quizId', quizzes.destroy);

    var scorm = require('../app/controllers/scorm');
    app.param('scormId', scorm.load);
    app.get('/scorm/:scormId/build', scorm.build);
    app.get('/scorm/:scormId/exportSCORM', scorm.exportSCORM);


    // tag routes
    var tags = require('../app/controllers/tags');
    app.get('/tags/:tag', tags.index);


    // dashboard routes
    app.get('/dashboard/index',role.can('access member page'), dashboard.index);
    app.get('/dashboard/admin',role.is('admin'), dashboard.admin);

    app.get('/dashboard/users/list', dashboard.listUser);




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

}

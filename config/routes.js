var async = require('async');

var users = require('../app/controllers/users');
var articles = require('../app/controllers/articles');
var dashboard = require('../app/controllers/dashboard');
var auth = require('./middlewares/authorization');
var ember = require('../app/controllers/emberStatic')



/**
 * Route middlewares
 * */



module.exports = function (app, passport){


    var articleAuth = [
//        auth.requiresLogin,
//        auth.article.hasAuthorization
    ];
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


    // article routes
    app.param('artid', articles.load);

    app.get('/articles', articles.index);
    if( process.env.NODE_ENV !== 'test'){
        app.get('/articles/new', articles.new);
        app.post('/articles', articles.create);
    }else{
        console.log("test will display this.")
        app.get('/articles/new', auth.requiresLogin, articles.new);
        app.post('/articles', auth.requiresLogin, articles.create);

    }

    app.get('/articles/:artid',  articles.show);
    app.get('/articles/:artid/edit', articleAuth, articles.edit);
    app.put('/articles/:artid', articleAuth, articles.update);
    app.del('/articles/:artid', articleAuth, articles.destroy);


    // ember
    app.get('/demo', ember.index);
    app.get('/',articles.index);

    var comments = require('../app/controllers/comments');
    app.param('commentId', comments.load);
    app.post('/articles/:artid/comments', auth.requiresLogin, comments.create);
    app.get('/articles/:artid/comments', auth.requiresLogin, comments.create);
    app.del('/articles/:artid/comments/:commentId', auth.requiresLogin, comments.destroy);


    var videos = require('../app/controllers/videos');
    app.param('videoId', videos.load);
    app.post('/articles/:artid/videos',articleAuth, videos.create);
    app.get('/articles/:artid/videos', articleAuth, videos.create);
    app.del('/articles/:artid/videos/:videoId', videos.destroy);

    var quizzes = require('../app/controllers/quizzes');
    app.param('quizId', videos.load);
    app.post('/articles/:artid/quizzes',articleAuth, quizzes.create);
    app.get('/articles/:artid/quizzes', articleAuth, quizzes.create);
    app.del('/articles/:artid/quizzes/:quizId', quizzes.destroy);


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

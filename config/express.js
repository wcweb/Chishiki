
/**
 * Module dependencies.
 */

var express = require('express');
var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
//var winston = require('winston');
var helpers = require('view-helpers');
var pkg = require('../package.json');

//var cons = require('consolidate');


var env = process.env.NODE_ENV || 'development';

module.exports = function(app, config, passport){
    app.set('trust proxy',true);
    app.set('showStackError', true);
    app.use(express.compress({
        filter: function (req, res){
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.favicon());
    app.use(express.static(config.root + '/public'));
    app.use(express.static(config.root + '/public/dist'));
    app.use(express.static(config.root + '/bower_components'));
    app.use('/tmp',  express.static(config.root + '/tmp'));
    var log;
    if(env !== 'development'){
        log = {
            stream: {
                write: function (message, encoding){
                    //winston.info(message);
                }
            }
        };
    } else {
        log = 'dev'
    }

    if(env !== 'test') app.use(express.logger(log));

    //app.engine('html', cons.swig);
    //app.engine('jade',cons.jade);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.configure(function(){
        // expose package.json to views
        app.use(function (req, res, next){
          // @TODO 3.0 use app.locals
            res.locals.pkg = pkg;
            next();
        })


        // cookieParser should be above session
        app.use(express.cookieParser())

        // bodyParser should be above methodOverride
        app.use(express.bodyParser())
        app.use(express.methodOverride())

        // express/mongo session storage
        app.use(express.session({
            secret: pkg.name,
            store: new mongoStore({
                url: config.db,
                collection : 'sessions'
            })
        }));



        // use passport session
        app.use(passport.initialize());
        app.use(passport.session());



        // connect flash for flash messages - should be declared after sessions
        app.use(flash());

        // should be declared after session and flash
        app.use(helpers(pkg.name));

        // add CSRF support
        if( process.env.NODE_ENV !== 'test'){
            app.use(express.csrf());

            // This could be moved to view-helpers :-)
            app.use(function(req, res, next){
                res.locals.csrf_token = req.csrfToken()
                next()
            })
        }

        app.use(app.router);



        app.use(function(err, req, res, next) {
            if(!err) return next(); // you also need this line
            console.error(err.stack);
            res.send("error!!!");
            next(err);
        });

        app.use(function(err, req, res, next){
            if(err.message
                && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))){
                return next();
            }
            console.error(err.stack);

            res.status(500).render('500', {error : err.stack});
        });

        app.use(function(req, res, next){
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        })

    });

    app.locals._= require('underscore');

    app.configure('development', function(){
        app.locals.pretty = true;
    });
}







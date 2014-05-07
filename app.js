
/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var passport = require('passport');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var mongoose = require('mongoose');

require('express-namespace');


var app = express();

require('./config/mongoose').connect(function(){


    var models_path = __dirname + '/app/models';
    fs.readdirSync(models_path).forEach(function (file){
        if (~file.indexOf('.js')){
            require(models_path+'/'+file);
        }
    });


    require('./config/passport')(passport, config);
    require('./config/express')(app, config, passport);
    require('./config/routes')(app, passport);
    require('./config/api')(app);


    if( process.env.NODE_ENV !== 'production'){
      app.use(express.errorHandler({
        dumpExceptions: true, showStack: true }))
    }

    
      if(config.socketEnable){
          var sio = require('socket.io');

          var server = require('http').createServer(app),
              io = sio.listen(server);

          require('./config/socketio')(io);
      }

      // console.log("instant init: "+process.env.NODE_ENV);
      
      if( process.env.NODE_ENV !== 'test'){
        require('./lib/dbUtils')
          .clearDb(require('./lib/dbUtils')
          .initDb(function(){
            console.log('inited database');
            var port = process.env.PORT || 3000;
            if(config.socketEnable){
                server.listen(port);
            }else{
                app.listen(port);
            }
            console.log('Express server listening on port ' + port);
          }));
         
      }
    
});







exports = module.exports = app;


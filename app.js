
/**
 * Module dependencies.
 */
var express = require('express.io');
var fs = require('fs');
var passport = require('passport');



var env = process.env.NODE_ENV || 'development';
console.log("instant init: "+process.env.NODE_ENV);
var config = require('./config/config')[env];

require('express-namespace');


var app = express();
app.http().io();



require('./config/mongoose').connect(function(){

  // init models
    var models_path = __dirname + '/app/models';
    
    fs.readdirSync(models_path).forEach(function (file){
        if (~file.indexOf('.js')){
            require(models_path+'/'+file);
        }
    });

  // init config
    require('./config/passport')(passport, config);
    require('./config/express')(express,app, config, passport);
    require('./config/routes')(app, passport);
    require('./config/api')(app, passport);


    if( process.env.NODE_ENV !== 'production'){
      app.use(express.errorHandler({
        dumpExceptions: true, showStack: true }))
    }
   
      // if(config.socketEnable){
      //     var sio = require('socket.io');
      // 
      //     var server = require('http').createServer(app),
      //         io = sio.listen(server);
      // 
      //     require('./config/socketio')(io);
      // }

      
      if( process.env.NODE_ENV !== 'test'){
        require('./lib/dbUtils')
          .clearDb(function(){
              require('./lib/dbUtils').initDb(function(){
                console.log('inited database');
                var port = process.env.PORT || 1234;
                if( process.env.NODE_ENV == 'production') port = 8080;
                // if(config.socketEnable){
 //                    server.listen(port);
 //                }else{
                    app.listen(port);
                // }
                console.log('Express server listening on port ' + port);
              })
            }
          );
      }
});







exports = module.exports = app;


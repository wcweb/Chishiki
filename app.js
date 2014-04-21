
/**
 * Module dependencies.
 */
require('express-namespace');
var express = require('express');
var fs = require('fs');
var passport = require('passport');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var mongoose = require('mongoose');




var connect = function(){
    var options = { server: { socketOptions: { keepAlive: 1}}}
    mongoose.connect(config.db, options);
}
connect();

mongoose.connection.on('error', function (err){
    console.log(err);
});

mongoose.connection.on('disconnected', function(){
    connect();
});

var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file){
    if (~file.indexOf('.js')){
        console.log(file);
        require(models_path+'/'+file);
    }
});
//require('./app/models/usersDao');
//require('./app/models/quizzesDao');
//require('./app/models/articlesDao');
//require('./app/models/scormsDao');


require('./config/passport')(passport, config);

var app = express();

require('./config/express')(app, config, passport);

require('./config/routes')(app, passport);

require('./config/api')(app);


if(config.socketEnable){
    var sio = require('socket.io');

    var server = require('http').createServer(app),
        io = sio.listen(server);

    require('./config/socketio')(io);
}
console.log("instant init: "+process.env.NODE_ENV);

if( process.env.NODE_ENV !== 'test'){
    require('./lib/dbUtils')
        .clearDb(require('./lib/dbUtils')
        .initDb());

    var port = process.env.PORT || 3000;
    if(config.socketEnable){
        server.listen(port);
    }else{
        app.listen(port);
    }


    console.log('Express server listening on port ' + port);
}





exports = module.exports = app;


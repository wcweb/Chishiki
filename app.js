
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
    if (~file.indexOf('.js')) require(models_path+'/'+file);
});


require('./config/passport')(passport, config);

var app = express();

require('./config/express')(app, config, passport);

require('./config/routes')(app, passport);

require('./config/api')(app);

console.log("instant init: "+process.env.NODE_ENV);

if( process.env.NODE_ENV !== 'test'){
    var port = process.env.PORT || 3000;
    app.listen(port);
    console.log('Express server listening on port ' + port);
}





exports = module.exports = app;


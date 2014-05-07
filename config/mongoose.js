
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var mongoose = require('mongoose');

var connect = function( cb ){
    var options = { server: { socketOptions: { keepAlive: 1}}}
    mongoose.connect(config.db, options);
    if(cb) cb();
}

mongoose.connection.on('error', function (err){
    console.log(err);
});

mongoose.connection.on('disconnected', function(){
    connect();
});


module.exports.connect = connect;

var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Answer = mongoose.model('Answer')
    , Quiz = mongoose.model('Quiz')
    , Nodo = mongoose.model('Nodo')
    , initDatabase = require('./helpers/data-example').initDatabase;
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var user, nodo, quiz;

exports.initDb = function (done) {
    return initDatabase(done);
}

exports.clearDb = function (done) {
    async.parallel([
        function (cb) {
            User.collection.remove(cb);
        },
        function (cb) {
            Nodo.collection.remove(cb);
        },
        function (cb) {
            Quiz.collection.remove(cb);
        },
        function (cb) {
            Answer.collection.remove(cb);
        }

    ], done);
}

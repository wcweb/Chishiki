var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Answer = mongoose.model('Answer')
    , Quiz = mongoose.model('Quiz')
    , Course = mongoose.model('Course')
    , Nodo = mongoose.model('Nodo')
    , Category = mongoose.model('Category')
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
            Category.collection.remove(cb);
        },
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
            Course.collection.remove(cb);
        },
        function (cb) {
            Answer.collection.remove(cb);
        }

    ], done);
}

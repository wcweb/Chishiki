var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

exports.load = function( req, res, next, id){
    next();
//    var nodo = req.nodo;
//
//
//    if(nodo.quizzes[0]._id == id){
//
//        req.quiz = nodo.quizzes;
//        next();
//    }else{
//        next('not found');
//    }


//    utils.findByParam(nodo.quizzes, { quiz:{_id:id} }, function(err, quiz){
//        console.log("findByParam",quiz);
//        if(err) return next(err);
//        req.quiz = quiz;
//        next();
//    });
}

exports.create = function( req, res){
    var nodo = req.nodo;

    if(!req.query.quizzes) return res.redirect('/nodos/' + nodo.id);
    nodo.addQuiz(req.query.quizzes, function(err){
        if(err) console.log(err);
        if(err) return res.jsonp('500',{message: err});
        req.flash('info', 'Quiz Added!');
        res.jsonp({art_id:nodo.id});
    });
}

exports.update = function (req, res){
    var nodo = req.nodo;
    //console.log("req.body.quizzes",req.body.quizzes);
    nodo.updateQuiz(req.body.quizzes, function(err){

        if(err) return res.jsonp('500',{message: err});
        req.flash('info', 'Quiz Added!');
        res.jsonp({art_id:nodo.id});
    });
}
//exports.edit = function(req,res){
//    var nodo = req.nodo;
//    var user = req.user;
//    if(!req.query.quizzes) return res.redirect('/nodos/' + nodo.id);
//
//    nodo.updateQuiz(req.query.quizzes, function(err){
//        if(err) return res.jsonp('500',{message: err});
//        req.flash('info', 'Update Quiz');
//        res.jsonp({art_id:nodo.id});
//    })
//}

exports.destroy = function( req, res){
    var nodo = req.nodo;
    //console.log(req.param('quizId'));
    nodo.removeQuiz(req.param('quizId'), function(err){
        if(err){
            req.flash('error', 'Oops! The Quiz was not found');
            //res.jsonp('500',{message: err});
        } else {
            //req.flash('info', 'Removed Quiz');
            res.jsonp('200',{art_id:nodo.id});
        }

    });
}

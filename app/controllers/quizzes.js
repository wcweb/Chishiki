var mongoose = require('mongoose');
var utils = require('../../lib/utils');

exports.load = function( req, res, next, id){
    var article = req.article;

    utils.findByParam(article.quizzes, { id: id }, function(err, quiz){
        if(err) return next(err);
        req.quiz = quiz;
        next();
    });
}

exports.create = function( req, res){
    var article = req.article;
    var user = req.user;
    if(!req.query.quizzes) return res.redirect('/articles/' + article.id);

    article.addQuiz(req.query.quizzes, function(err){
        if(err) return res.jsonp('500',{message: err});
        req.flash('info', 'Quiz Added!');
        res.jsonp({art_id:article.id});
    });
}

//exports.edit = function(req,res){
//    var article = req.article;
//    var user = req.user;
//    if(!req.query.quizzes) return res.redirect('/articles/' + article.id);
//
//    article.updateQuiz(req.query.quizzes, function(err){
//        if(err) return res.jsonp('500',{message: err});
//        req.flash('info', 'Update Quiz');
//        res.jsonp({art_id:article.id});
//    })
//}

exports.destroy = function( req, res){
    var article = req.article;
    console.log(req.param('quizId'));
    article.removeQuiz(req.param('quizId'), function(err){
        if(err){
            req.flash('error', 'Oops! The Quiz was not found');
            //res.jsonp('500',{message: err});
        } else {
            //req.flash('info', 'Removed Quiz');
            res.jsonp('200',{art_id:article.id});
        }

    });
}
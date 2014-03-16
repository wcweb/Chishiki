var mongoose = require('mongoose');
var utils = require('../../lib/utils');

exports.load = function( req, res, next, id){
    var article = req.article;
    utils.findByParam(article.comments, { id: id }, function(err, comment){
        if(err) return next(err);
        req.comment = comment;
        next();
    });
}

exports.create = function( req, res){
    var article = req.article;
    var user = req.user;
    // why body.body
    if(!req.body.body) return res.redirect('/articles/' + article.id);

    article.addComment(user, req.body, function(err){
        if(err) return res.render('500');
        res.redirect('/articles/' + article.id);
    });
}

exports.destroy = function( req, res){
    var article = req.article;
    article.removeComment(req.param('commentId'), function(err){
        if(err){
            req.flash('error', 'Oops! The comment was not found');
        } else {
            req.flash('info', 'Removed comment');
        }
        res.redirect('/articles/'+ article.id);
    });
}
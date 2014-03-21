var mongoose = require('mongoose');
var utils = require('../../lib/utils');

exports.load = function( req, res, next, id){
    var article = req.article;

    utils.findByParam(article.videos, { id: id }, function(err, video){
        if(err) return next(err);
        req.video = video;
        next();
    });
}

exports.create = function( req, res){
    var article = req.article;
    var user = req.user;
    if(!req.query.videos) return res.redirect('/articles/' + article.id);

    article.addVideo(req.query.videos, function(err){
        if(err) return res.jsonp('500',{message: err});
        req.flash('info', 'Video Added!');
        res.jsonp({art_id:article.id});
    });
}

//exports.edit = function(req,res){
//    var article = req.article;
//    var user = req.user;
//    if(!req.query.videos) return res.redirect('/articles/' + article.id);
//
//    article.updateVideo(req.query.videos, function(err){
//        if(err) return res.jsonp('500',{message: err});
//        req.flash('info', 'Update Video');
//        res.jsonp({art_id:article.id});
//    })
//}

exports.destroy = function( req, res){
    var article = req.article;
    console.log(req.param('videoId'));
    article.removeVideo(req.param('videoId'), function(err){
        if(err){
            req.flash('error', 'Oops! The Video was not found');
            //res.jsonp('500',{message: err});
        } else {
            //req.flash('info', 'Removed Video');
            res.jsonp('200',{art_id:article.id});
        }

    });
}
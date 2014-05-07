var mongoose = require('mongoose');
var utils = require('../../lib/utils');

exports.load = function( req, res, next, id){
    var nodo = req.nodo;

    utils.findByParam(nodo.videos, { id: id }, function(err, video){
        if(err) return next(err);
        req.video = video;
        next();
    });
}

exports.create = function( req, res){
    var nodo = req.nodo;
    var user = req.user;
    if(!req.query.videos) return res.redirect('/nodos/' + nodo.id);

    nodo.addVideo(req.query.videos, function(err){
        if(err) return res.jsonp('500',{message: err});
        req.flash('info', 'Video Added!');
        res.jsonp({art_id:nodo.id});
    });
}

//exports.edit = function(req,res){
//    var nodo = req.nodo;
//    var user = req.user;
//    if(!req.query.videos) return res.redirect('/nodos/' + nodo.id);
//
//    nodo.updateVideo(req.query.videos, function(err){
//        if(err) return res.jsonp('500',{message: err});
//        req.flash('info', 'Update Video');
//        res.jsonp({art_id:nodo.id});
//    })
//}

exports.destroy = function( req, res){
    var nodo = req.nodo;
    console.log(req.param('videoId'));
    nodo.removeVideo(req.param('videoId'), function(err){
        if(err){
            req.flash('error', 'Oops! The Video was not found');
            //res.jsonp('500',{message: err});
        } else {
            //req.flash('info', 'Removed Video');
            res.jsonp('200',{art_id:nodo.id});
        }

    });
}

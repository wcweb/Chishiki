/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Nodo = mongoose.model('Nodo');
var utils = require('../../lib/utils');
var extend = require('util')._extend;


exports.load = function(req, res, next, id){
    var User = mongoose.model('User');
    Nodo.load(id, function(err, nodo){
        //if (err) return next(err);
        //if (!) return next(new Error('not found'));
        if (err) {
          req.flash('error', 'no that nodo you requested! ');
          return res.redirect('/');
        }
        if(nodo){
          req.nodo = nodo;
        }else{

          req.flash('error', 'no that nodo you requested! ');
          return res.redirect('/');
        }
        next();

    });
}

exports.index = function(req, res){
    var page = (req.param('page') > 0 ? req.param('page') : 1) -1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    Nodo.list(options, function(err, nodos){
        if(err) return res.render('500');
        Nodo.count().exec(function (err, count){
            res.render('nodos/index', {
                title: 'Knowledges',
                nodos: nodos,
                page: page+1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
}


exports.new = function(req, res){
    res.render('nodos/new', {
        title: 'New Nodo',
        nodo: new Nodo({})
    });
}


exports.create = function (req, res){
    var nodo = new Nodo(req.body);
    nodo.user = req.user;
    nodo.uploadAndSave(req.files.image, function(err){
        if(!err){
            req.flash('success', 'Successfully created  !');
            return res.redirect('/nodos/'+ nodo._id);
        }

        res.render('nodos/new', {
            title: 'New Nodo',
            nodo: nodo,
            errors: utils.errors(err.errors || err)
        });
    });
}


exports.edit = function (req, res){
    res.render('nodos/edit', {
        title: 'Edit: ' + req.nodo.title,
        nodo: req.nodo
    });
}

exports.update = function (req, res){
    var  nodo = req.nodo;
    nodo = extend(nodo, req.body);
    nodo.uploadAndSave(req.files.image, function(err){
        if(!err){
            return res.redirect('/nodos/' + nodo._id);
        }

        res.render('nodos/edit', {
            title: 'Edit Nodo',
            nodo: nodo,
            errors: utils.errors(err.errors || err)
        });
    });
}


exports.show = function (req, res){
    res.render('nodos/show', {
        title:  req.nodo.title,
        nodo: req.nodo
    });
}


exports.destroy = function (req, res){
    var nodo = req.nodo;
    nodo.remove(function (err){
        req.flash('info', 'Deleted Successfully');
        res.redirect('/nodos');
    });
}



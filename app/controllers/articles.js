/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');
var extend = require('util')._extend;


exports.load = function(req, res, next, id){
    var User = mongoose.model('User');
    Article.load(id, function(err, article){
        if (err) return next(err);
        if (!article) return next(new Error('not found'));
        req.article = article;
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

    Article.list(options, function(err, articles){
        if(err) return res.render('500');
        Article.count().exec(function (err, count){
            res.render('articles/index', {
                title: 'Articles',
                articles: articles,
                page: page+1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
}


exports.new = function(req, res){
    res.render('articles/new', {
        title: 'New Article',
        article: new Article({})
    });
}


exports.create = function (req, res){
    var article = new Article(req.body);
    article.user = req.user;
    article.uploadAndSave(req.files.image, function(err){
        if(!err){
            req.flash('success', 'Successfully created article !');
            return res.redirect('/articles/'+ article._id);
        }

        res.render('articles/new', {
            title: 'New Article',
            article: article,
            errors: utils.errors(err.errors || err)
        });
    });
}


exports.edit = function (req, res){
    res.render('articles/edit', {
        title: 'Edit' + req.article.title,
        article: req.article
    });
}

exports.update = function (req, res){
    var article = req.article;
    article = extend(article, req.body);

    article.uplaodAndSave(req.files.image, function(err){
        if(!err){
            return res.redirect('/articles/' + article._id);
        }

        res.render('articles/edit', {
            title: 'Edit Article',
            article: article,
            errors: utils.errors(err.errors || err)
        });
    });
}


exports.show = function (req, res){
    res.render('articles/show', {
        title:  req.article.title,
        article: req.article
    });
}


exports.destroy = function (req, res){
    var article = req.article;
    article.remove(function (err){
        req.flash('info', 'Deleted Successfully');
        res.redirect('/articles');
    });
}



var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Scorm = mongoose.model('Scorm');



exports.load = function( req, res, next, id){
    var User = mongoose.model('User');
    Article.load(id, function(err, article){
        if (err) return next(err);

        if (article)
            req.article = article;
        next();
    });
}

exports.build = function(req, res){
    var scorm = new Scorm();

    scorm.build(req.article, function(err){
        if(!err){
            req.flash('success', 'Successfully created article !');
            res.jsonp(scorm);
        }
    })






}
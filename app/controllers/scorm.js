var mongoose = require('mongoose');
var Nodo = mongoose.model('Nodo');
var Scorm = mongoose.model('Scorm');



exports.load = function( req, res, next, id){
    var User = mongoose.model('User');
    Nodo.load(id, function(err, nodo){
        if (err) return next(err);

        if (nodo)
            req.nodo = nodo;
        next();
    });
}

exports.build = function(req, res){
    var scorm = new Scorm();

    scorm.build(req.nodo, function(err,result){
        if(err) throw err;
        req.flash('success', 'Successfully created nodo !');
        res.jsonp(scorm);
    })
}

exports.exportSCORM = function(req, res){
    if(!req.nodo.scorm){
        req.flash('error', 'nodo do not contain SCORM, build it first !');
        return res.redirect(req.url);
    }
    var scorm = req.nodo.scorm;
    scorm.exportSCORM(req.nodo, function(err){
        if(err) throw err;
        if(!err){
            req.flash("success", " You can download! <a href='" + scorm.zipFile +"' > click here </a>");
            res.jsonp(scorm);
        }
    })

}

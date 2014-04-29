var mongoose = require('mongoose');
var Nodo = mongoose.model('Nodo');

var async = require('async');

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
            res.render('home/index', {
                title: 'Knowledges',
                nodos: nodos,
                page: page+1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
}

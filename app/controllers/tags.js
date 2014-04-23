var mongoose = require('mongoose');
var Nodo = mongoose.model('Nodo');

exports.index = function (req, res){
    var criteria = { tags: req.param('tag') };
    var perPage = 5;
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    };

    Nodo.list(options, function(err, nodos){
        if(err) return res.render('500');
        Nodo.count(criteria).exec(function (err, count){
            res.render('nodos/index', {
                title: 'Nodos tagged ' + req.param('tag'),
                nodos: nodos,
                page: page +1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
}

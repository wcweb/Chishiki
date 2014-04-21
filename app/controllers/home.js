var mongoose = require('mongoose');
var Article = mongoose.model('Article');


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
            res.render('home/index', {
                title: 'Knowledges',
                articles: articles,
                page: page+1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
}
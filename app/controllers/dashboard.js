var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');


exports.index = function (req, res){
    res.render('dashboard/index',{title:'Dashboard Index'});
}

exports.admin = function (req, res){
    res.render('dashboard/admin',{title:'Dashboard Admin'});
}


/**
 *  Find all user
 * */

exports.listUser = function(req, res){

    User
        .find({})
        .exec(function(err,users){

            if(err) return err;

            Article.find()
                .populate('user', 'name email username')
                .exec(function(err,articles){

                    if(err) return err;

                    var article, usr, results=[];
                    for(var i=0; i< articles.length; i++){
                        article = articles[i];

                        (function(){
                            for(var j=0; j< users.length; j++){
                                usr= users[j];
                                if( article.user.name == usr.name ){
                                    var userArticle = {};
                                    userArticle = usr;
                                    userArticle['articles']=[];
                                    userArticle['articles'].push(article);
                                    results.push(userArticle);
                                }
                            }
                        })();


                    }
                    res.render('dashboard/listUser',{users: results});
                });

        });


}
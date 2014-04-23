var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
var Nodo = mongoose.model('Nodo');
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

            Nodo.find()
                .populate('user', 'name email username')
                .exec(function(err,nodos){

                    if(err) return err;

                    var nodo, usr, results=[];
                    for(var i=0; i< nodos.length; i++){
                        nodo = nodos[i];

                        (function(){
                            for(var j=0; j< users.length; j++){
                                usr= users[j];
                                if( nodo.user.name == usr.name ){
                                    var userNodo = {};
                                    userNodo = usr;
                                    userNodo['nodos']=[];
                                    userNodo['nodos'].push(nodo);
                                    results.push(userNodo);
                                }
                            }
                        })();


                    }
                    res.render('dashboard/listUser',{users: results});
                });

        });


}

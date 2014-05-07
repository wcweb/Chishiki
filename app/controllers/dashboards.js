var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
var Nodo = mongoose.model('Nodo');
var utils = require('../../lib/utils');
var forms = require('../../lib/helpers/form-builder');
var NodoDao = require('../models/nodosDao');
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
                                if(!nodo.user) continue;
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

var bootstrap_field = function (name, object) {
  // console.log(object);
    console.log("classes: ",object.classes());

    var label = '<div class="controls  col-sm-3"><lable class="label">' +object.labelText(name)+ '</lable></div>';
    var error = object.error ? '<p class="form-error-tooltip">' + object.error + '</p>' : '';
    object.widget.classes= "form-control";
    
    var widget = '<div class="controls col-sm-9">' + object.widget.toHTML(name, object) + error + '</div>';
    return '<div class="field  form-group ' + (error !== '' ? 'has-error' : '')  + '">' + label + widget + '</div>';
}

exports.newNodo = function(req, res){
  var form = forms.create(NodoDao,{},'new');
  // console.log("ss",form);
  // console.dir(Nodo.schema.paths);
  res.render('dashboard/newNodo', { form: form.toHTML(function (name, object) { return bootstrap_field(name, object); })});
  
}

var mongoose = require('mongoose')
  , Nodo = mongoose.model('Nodo')
  , Course = mongoose.model('Course')
  , ObjectId = mongoose.Types.ObjectId
  , Category = mongoose.model('Category');

var extend = require('util')._extend;
var async = require('async');
var mongoHelper = require('../../lib/helpers/mongo-helper');


exports.list = function(req,res,next){
    Category.aggregate(
      {$group:{
        _id:'$categoryType',
        categories: { $push: "$$ROOT" }
      }})
      .exec(function(err, categories){
      if( err ) next(err);
      res.locals.categories = categories;
      next();
    });
}




exports.all = function(req, res){
    Category.find({}, function(err, categories){
      if( err ) next(err);
      if( !categories ) res.redirect('/');
      res.render('categories/index', {
        title: 'categories',
        categories: categories,
      });
    });
}

exports.show = function(req, res){
    var category_criteria = {};

    if(mongoHelper.isObjectId(req.params['category'])){
      category_criteria = {
        "_id": ObjectId(req.params['category'])
      // "categoryType": req.params['categoryType']
      };
    }else{
      category_criteria = {
        "label": req.params['category']
      // "categoryType": req.params['categoryType']
      };
    }

    var perPage = 2;
    var nodos_page = (req.param('nodos_page') > 0 ? req.param('nodos_page') : 1) - 1;
    var courses_page = (req.param('courses_page') > 0 ? req.param('courses_page') : 1) - 1;
    var options = {
        perPage: perPage,
        nodos_page: nodos_page,
        courses_page: courses_page
    };

    Category.findOne(category_criteria)
    .exec(function(err, category){
      if(err) throw err;
      if(category== null){
        req.flash('error', 'There do not existed category  named'+req.params['category']);
        return res.redirect('/');
      }
      var criteria = {'categories':category._id};

      async.auto({
        getCategoriedNodos: function(scb){
          Nodo.find(criteria)
              .populate('user', 'name username')
              .sort({'createdAt': -1})
              .limit(options.perPage)
              .skip(options.perPage * options.nodos_page)
              .exec(function(err, nodos){
                if(err) throw err;


              Nodo.count(criteria).exec(function (err, count){
                  if(err) throw err;
                  scb(null, {nodos:nodos, count:count});
              });

          });

        },

        getCategoriedCourses: function(scb){
          Course.find(criteria)
              .populate('user', 'name username')
              .sort({'createdAt': -1})
              .limit(options.perPage)
              .skip(options.perPage * options.courses_page)
              .exec(function(err, courses){
                if(err) throw err;

              Course.count(criteria).exec(function (err, count){
                  if(err) throw err;
                  scb(null, {courses:courses, count:count});
              });

          });
        }
      },
        function (err,result){
          if(err) throw err;
          var nodos = result.getCategoriedNodos.nodos;
          var nodos_count = result.getCategoriedNodos.count;
          var courses = result.getCategoriedCourses.courses;
          var courses_count = result.getCategoriedCourses.count;

          res.render('categories/show', {
              title: category.label,
              nodos: nodos,
              courses:courses,
              nodos_page: nodos_page +1,
              nodos_pages: Math.ceil(nodos_count / perPage),
              courses_page: courses_page +1,
              courses_pages: Math.ceil(courses_count / perPage)
          });

        });
    });



}

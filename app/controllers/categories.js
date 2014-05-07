var mongoose = require('mongoose')
  , Nodo = mongoose.model('Nodo')
  , ObjectId = mongoose.Types.ObjectId
  , Category = mongoose.model('Category');



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

exports.index = function(req, res){

    var criteria = {
      'categories': ObjectId(req.params['category'])
    };
    var perPage = 5;
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    };

    Category.findOne({
      "_id": ObjectId(req.params['category'])
      // ,
      // "categoryType": req.params['categoryType']
    })
              .exec(function(err, category){
                if(err) throw err;
                if(category== null){
                  req.flash('error', 'There is not  category '+req.params['category']);
                  res.redirect('/');
                } 

                Nodo.find(criteria)
                    .populate('user', 'name username')
                    .sort({'createdAt': -1})
                    .limit(options.perPage)
                    .skip(options.perPage * options.page)
                    .exec(function(err, nodos){
                      if(err) throw err;

                    Nodo.count(criteria).exec(function (err, count){
                        if(err) throw err;
                        res.render('nodos/index', {
                            title: 'Nodos categoried ' + category.label,
                            nodos: nodos,
                            page: page +1,
                            pages: Math.ceil(count / perPage)
                        });
                    });

                });
              });


    //Nodo.list(options, function(err, nodos){
            //if(err) throw err;
        //console.log(nodos);


        //Nodo.count(criteria).exec(function (err, count){
            //if(err) throw err;
            //res.render('nodos/index', {
                //title: 'Nodos categoried ' + req.param('category'),
                //nodos: nodos,
                //page: page +1,
                //pages: Math.ceil(count / perPage)
            //});
        //});
    //});

}

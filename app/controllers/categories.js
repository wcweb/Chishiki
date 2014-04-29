var mongoose = require('mongoose')
  , Category = mongoose.model('Category');


export.list = function(req,res,next){
    Category.find({}, function(err, categories){
      res.locals.categories = categories;
      next();
    });
}

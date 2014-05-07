var mongoose = require('mongoose')
  , Course = mongoose.model('Course')
  , ObjectId = mongoose.Types.ObjectId
  , Category = mongoose.model('Category');


  exports.load = function(req, res, next, id){
      var User = mongoose.model('User');
      Course.load(id, function(err, course){
          //if (err) return next(err);
          //if (!) return next(new Error('not found'));
          if (err) {
            req.flash('error', 'no that nodo you requested! ');
            return res.redirect('/');
          }
          if(course){
            req.course = course;
          }else{

            req.flash('error', 'no that nodo you requested! ');
            return res.redirect('/');
          }
          next();

      });
  };
  
  
  exports.list = function(req,res,next){
      Course.list({}, function(err, courses){
        if( err ) next(err);

        res.locals.courses = courses;
        next();
      });
  };

  exports.index = function(req, res){
      var page = (req.param('page') > 0 ? req.param('page') : 1) -1;
      var perPage = 30;
      var options = {
          perPage: perPage,
          page: page
      };

      Course.list(options, function(err, courses){
          if(err) return res.render('500');
          Course.count().exec(function (err, count){
              res.render('courses/index', {
                  title: 'Courses',
                  courses: courses,
                  page: page+1,
                  pages: Math.ceil(count / perPage)
              });
          });
      });
  }

  exports.show = function (req, res){
      res.render('courses/show', {
          title:  req.course.title,
          course: req.course
      });
  }

var mongoose = require('mongoose')
  , Course = mongoose.model('Course')
  , Nodo = mongoose.model('Nodo')
  , ObjectId = mongoose.Types.ObjectId
  , Category = mongoose.model('Category');

var extend = require('util')._extend;

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


exports.new = function(req, res){
  res.render('courses/new', {
    title: 'New course',
    course: new Course({})
  });
}

exports.create = function(req,res){
  var course = new Course(req.body);
  course.user = req.user;
  course.uploadAndSave(req.files.image, function(err){
      if(!err){
          req.flash('success', 'Successfully created  !');
          return res.redirect('/courses/'+ course.name +'/nodos');
      }

      res.render('courses/new', {
          title: 'New course',
          course: course,
          errors: utils.errors(err.errors || err)
      });
  });

}
exports.edit = function(req,res){
  res.render('courses/edit', {
      title: 'Edit: ' + req.course.name,
      course: req.course
  });
}
exports.update = function(req,res){
  var  course = req.course;
  course = extend(course, req.body);
  course.uploadAndSave(req.files.image, function(err){
      if(!err){
          return res.redirect('/courses/' + course.name + '/nodos');
      }

      res.render('courses/edit', {
          title: 'Edit course',
          course: course,
          errors: utils.errors(err.errors || err)
      });
  });
}
exports.show = function (req, res){
    res.render('courses/show', {
        title:  req.course.title,
        course: req.course
    });
}
exports.destroy = function(req,res){
  var course = req.course;
  course.remove(function (err){
      req.flash('info', 'Deleted Successfully');
      res.redirect('/courses');
  });

}

exports.nodos = function(req, res){
  var user = req.user;
  Nodo.find({user: user})
      .exec(function(err, nodos){
        if(err) throw err;

        if(nodos.length)
          user.nodos = nodos;
        res.render('courses/nodos', {
          title: 'Nodos: '+ req.course.name,
          course: req.course,
          user: user
        });
      });
}

exports.nodosEdit = function(req, res){
  var course = req.course;
}

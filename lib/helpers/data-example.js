var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Answer = mongoose.model('Answer')
    , Course = mongoose.model('Course')
    , Quiz = mongoose.model('Quiz')
    , Category = mongoose.model('Category')
    //, Tag = mongoose.model('Tag')
    , Nodo = mongoose.model('Nodo');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var quizExample = require('../fixture/quiz').quiz;
var _ = require('underscore');

exports.initDatabase = function(callback){
    var users = []
      , nodos = []
      , quizzes = []
      , tags = []
      , courses = []
      , categories=[];
    async.auto({
      initQuizzes: function(cb){
        var count =4;
        async.whilst(
            function () {
                return count > 0;
            },
            function (done) {
              var quiz = new Quiz(quizExample);
              quiz.info.name = quiz.info.name+ " xx "+ count;
              quiz.save(function (err) {
                  if (err) return err;
                  quizzes.push(quiz);
                  count --;
                  done();
              });
            },
            function(err,result){
              if(err) throw err;
              cb();
            });
      },
      initUsers: function(cb){
            var count = 4;
            async.whilst(
                function () {
                    return count > 0;
                },
                function (done) {
                    user = new User({
                        email: 'foobarTest' + count + '@example.com',
                        name: 'Foo' + count + ' bar',
                        username: 'foobar' + count + 'Test',
                        password: 'foobar'
                    });
                    if(count ==1){
                      user.role = 'admin';
                    }
                    user.save(function (err) {
                        if (err) throw  err;
                        count--;
                        users.push(user);
                        done();
                    });
                },
                function (err) {
                    if (err)  throw err;
                    cb();
              });
      },
      initNodos: [ 'initQuizzes', function(cb,result){
            var count = 16;
            async.whilst(
                function () {
                    return count > 0;
                },
                function (done) {
                  nodo = new Nodo({
                      title: 'Nodo ' + count ,
                        body:
                            'is body Cras sit amet nibh libero, ' +
                            'in gravida nulla. Nulla vel metus scelerisque' +
                            ' ante sollicitudin commodo. Cras purus odio,' +
                            ' vestibulum in vulputate at, tempus viverra' +
                            ' turpis. Fusce condimentum nunc ac nisi' +
                            ' vulputate fringilla. Donec lacinia' +
                            ' congue felis in faucibus.',
                        image:{},
                        videos: [
                            { title: " YouKu api",
                                link: 'http://localhost:3000/demo.mp4'}
                        ],
                        reading:"",
                        quizzes: []
                    });
                    if (count % 2) {
                        nodo.quizzes.push({quiz:quizzes[count]});
                        nodo.tags = 'tag1,tag2';
                    }
                    if (count % 3 == 0){
                        nodo.image = {
                            cdnUri:''+config.uploadImagesDirectory
                            ,files:['1397551139414.jpg']
                        };
                    }
                    if (count % 3 == 1) {
                        nodo.image = {cdnUri:''+config.uploadImagesDirectory,
                        files:['1397551121512.jpg']};
                    }
                    if (count % 3 == 2) {
                        nodo.image = {
                            cdnUri:''+config.uploadImagesDirectory,
                            files:['1397550603783.jpg']
                        };
                    }

                    nodo.save(function (err, nodo) {
                      if(err) throw err;
                        count--;
                        nodos.push(nodo);
                        done();
                    });
                },
                function (err) {
                    if (err)  console.dir(err,'stack');
                    cb();
              });
          }
      ],
       initCategories: function(cb){
         var count = 4;
         async.whilst(
            function () {
                  return count > 0;
            },
            function (done) {
               var category = new Category({
                 label: ' Category '+ count,
                 description: ' descriptons about ...'+count,
                 children:[],
                 parent:null
               });
               if(count%2){
                 category.categoryType="type1";
               }else{
                 category.categoryType="teyp2";
               }
               category.save(function(err, cat){
                 if(err) throw err;
                 count--;
                 categories.push(cat);
                 done();
               });
            },
            function (err, result){
              if(err) throw err;
              cb();
            }
          );

       },
       initCourses: function(cb){
         var count = 4;
         async.whilst(
            function(){
              return count > 0;
            },
            function(done){
              var course = new Course({
                name: ' Course '+count,
                description: ' descriptions about ... '
              });
              course.save(function(err, cour){
                if(err) throw err;
                count --;
                courses.push(cour);
                done();
              });
            },
            function(err, result){
              if(err) throw err;
              cb();
            });
       },
       relationMap: [ 'initQuizzes', 'initUsers', 'initNodos', 'initCategories',
          function(cb){
            async.auto({
              node_user: function(scb){
                nodos.forEach(function(nodo, idx){
                  var userIdx = idx%4;
                  nodo.user = users[userIdx];
                  nodo.save();
                });
                scb();
              },
              node_quiz: function(scb){

                scb();
              },
              node_category: function(scb){
                nodos.forEach(function(nodo, idx){
                  var num = idx%categories.length;
                  nodo.categories.push( categories[num]);
                  nodo.save();
                });

                scb();
              },
              course_category: function(scb){
                courses.forEach(function(course, idx){
                  var num = idx%categories.length;
                  course.categories.push( categories[num]);
                  if(num!==categories.length-1)
                    course.categories.push(categories[categories.length-1]);
                  course.save();
                })
                scb();
              },
              fontpage_nodo: function(scb){
                for(var i=4;i<8;i++){
                  (function(){
                    nodos[i].frontpage = true;
                    nodos[i].save();
                  })();
                }
                scb();

              },
              course_participants:function(scb){
                courses.forEach(function(course, idx){
                  var num = idx%users.length;
                  course.user = users[num];
                  course.participants.push(users[num]);
                  if(num!==users.length-1)
                  course.participants.push(users[users.length-1]);
                  course.save();
                });
                scb();

              },

              course_nodo: function(scb){
                courses.forEach(function(course, idx){
                  var num = idx%nodos.length;
                  nodos.forEach(function(nodo, idy){
                    if(idy!== num) course.nodos.push( nodos[idy]);
                  })
                  course.save();
                })
                scb();
              }
            }, function(err, result){
              cb();
            });

          }
       ]
    },
      function(err, result){
        if (err) throw err;
        callback();
      });
}


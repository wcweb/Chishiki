var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Quiz = mongoose.model('Quiz')
    , Nodo = mongoose.model('Nodo');

module.exports = function (app,passport) {

    // Create an API namespace, so that the root does not
    // have to be repeated for each end point.
    app.namespace('/api', function () {
      // app.all('*', function(req, res, next) {
      //   // @TODO allow white list
      //   res.header("Access-Control-Allow-Origin", "*");
      //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
      //   next();
      //  });
       
       app.get('/userinfo', passport.authenticate('bearer', { session: false }), function(req, res){
      
           // req.authInfo is set using the `info` argument supplied by
           // `BearerStrategy`.  It is typically used to indicate scope of the token,
           // and used in access control checks.  For illustrative purposes, this
           // example simply returns the scope in the response.
          
           res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope });
       });
       
       // app.post('/session', function(req, res){
       //   
       //   passport.authenticate('bearer', { session: false });
       //   var userReq = req.body.session['login_or_email'];
       //   User.findOne({username: userReq})
       //   .exec(function(err, user){
       //     //JSON.stringify(user)
       //     if(err) throw err;
       //     
       //     if(user !== null){
       //       console.log(user == true);
       //       res.jsonp({auth_token:user.authToken,account_id:user.id});
       //     }else{
       //       res.send('no user');
       //     }
       //     
       //   })
       // })

        app.get('/users', function (req, res) {
            User.find({})
                .exec(function (err, users) {
                    res.send({users: users});
                })
        })
        app.get('/users/:id', function (req, res) {
          res.send(JSON.stringify(users));
            //User.findOne({})
                //.exec(function (err, users) {
                    //res.send({users: users});
                //})
        })

        app.get('/nodos', function (req, res) {
            Nodo.find({}, '_id title comments body')
                .exec(function (err, nodos) {
                    res.send(JSON.stringify({"nodos": nodos}));
                })

        });
        // Return fixture data for '/api/posts/:id'
        app.get('/nodos/:id', function (req, res) {
            Nodo.findOne({})
                .exec(function (err, nodo) {
                    res.send({"nodo": nodo});
                })
        });

        app.get('/quiz/:id', function (req, res) {

            res.format({
                json: function () {
                    Quiz.findOne({})
                        .exec(function (err, result) {
                            res.send(result);
                        });
                }
            });


        });

    });

};

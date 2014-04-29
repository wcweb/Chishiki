var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Quiz = mongoose.model('Quiz')
    , Nodo = mongoose.model('Nodo');

module.exports = function (app) {

    // Create an API namespace, so that the root does not
    // have to be repeated for each end point.
    app.namespace('/api', function () {
        var post = {
            "post": {
                "id": 1,
                "title": "Rails is omakase",
                "comments": ["1", "2"],
                "user": "dhh"
            },

            "comments": [
                {
                    "id": "1",
                    "body": "Rails is unagi"
                },
                {
                    "id": "2",
                    "body": "Omakase O_o"
                }
            ]
        };
        var posts = {

            "posts": [
                {
                    "id": 1,
                    "title": "这里是标题",
                    "comments": ["1", "2"],
                    "user": "这里是内容",
                },
                {
                    "id": 2,
                    "title": "这里是标题",
                    "comments": ["1", "2"],
                    "user": "这里是内容",
                }
            ],

            "comments": [
                {
                    "id": "1",
                    "body": "这里是评论"
                },
                {
                    "id": "2",
                    "body": "这里是评论"
                }
            ]

        }
        app.get('/posts', function (req, res) {
            res.send(JSON.stringify(posts));
        })
        app.get('/posts/:id', function (req, res) {
            res.send(JSON.stringify(post));
        })

        var users = {
           user:{
             _id:123,
             name:'abc',
             username: 'username',
             email: 'aaa@sss.com',
             role: 'role'
           }
        };

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

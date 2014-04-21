var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Quiz = mongoose.model('Quiz')
    , Article = mongoose.model('Article');

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

        app.get('/users', function (req, res) {
            User.find({})
                .exec(function (err, users) {
                    res.send({users: users});
                })
        })

        app.get('/articles', function (req, res) {
            Article.find({}, '_id title comments body')
                .exec(function (err, articles) {
                    res.send(JSON.stringify({"post": articles}));
                })

        });
        // Return fixture data for '/api/posts/:id'
        app.get('/articles/:id', function (req, res) {
            Article.findOne({})
                .exec(function (err, article) {
                    res.send({"post": article});
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
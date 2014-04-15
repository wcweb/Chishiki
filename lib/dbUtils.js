var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Answer = mongoose.model('Answer')
    , Quiz = mongoose.model('Quiz')
    , Article = mongoose.model('Article')
    , QuizExample = require('./helpers/data-example').quiz;
var user, article, quiz;

exports.initDb = function () {

    quiz = new Quiz(QuizExample);
    quiz.save(function (err) {
        if (err) return err;
        console.log('inited quiz');

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
                user.save(function (err) {
                    if (err) return err;
                    console.log('init user');
                    if (count % 2) {
                        article = new Article({
                            title: 'foo' + count + ' bar',
                            body: 'this ' + count +
                                'is body Cras sit amet nibh libero, ' +
                                'in gravida nulla. Nulla vel metus scelerisque' +
                                ' ante sollicitudin commodo. Cras purus odio,' +
                                ' vestibulum in vulputate at, tempus viverra' +
                                ' turpis. Fusce condimentum nunc ac nisi' +
                                ' vulputate fringilla. Donec lacinia' +
                                ' congue felis in faucibus.',
                            user: user,
                            videos: [
                                { title: " HD", link: " http://youku.com/"},
                                { title: " SD ", link: " http://tudou.com/"}
                            ],
                            quizzes: [{quiz:quiz}]
                        });

                    }
                    else {
                        article = new Article({
                            title: 'foo' + count + ' bar',
                            body: 'this ' + count +
                                'is body Cras sit amet nibh libero, ' +
                                'in gravida nulla. Nulla vel metus scelerisque' +
                                ' ante sollicitudin commodo. Cras purus odio,' +
                                ' vestibulum in vulputate at, tempus viverra' +
                                ' turpis. Fusce condimentum nunc ac nisi' +
                                ' vulputate fringilla. Donec lacinia' +
                                ' congue felis in faucibus.',
                            user: user,
                            videos: [
                                { title: " HD", link: " http://youku.com/"},
                                { title: " SD ", link: " http://tudou.com/"}
                            ],
                            quizzes: []
                        });
                    }
                    article.save(function (err) {

                        if (err) return console.log(err);
                        count--;
                        console.log('init article');
                        done();
                    });
                });


            },


            function (err) {
                if (err){
                    console.error(err.stack);
                    console.dir(err,'stack');
                }

            }

        );


    });

}

exports.clearDb = function (done) {
    async.parallel([
        function (cb) {
            User.collection.remove(cb);
        },
        function (cb) {
            Article.collection.remove(cb);
        },
        function (cb) {
            Quiz.collection.remove(cb);
        },
        function (cb) {
            Answer.collection.remove(cb);
        }

    ], done);
}
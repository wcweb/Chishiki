var mongoose = require('mongoose')
    , async = require('async')
    , User = mongoose.model('User')
    , Answer = mongoose.model('Answer')
    , Quiz = mongoose.model('Quiz')
    , Nodo = mongoose.model('Nodo')
    , QuizExample = require('./helpers/data-example').quiz;
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var user, nodo, quiz;

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
                    nodo = new Nodo({
                        title: 'Title ' + count ,
                        body:
                            'is body Cras sit amet nibh libero, ' +
                            'in gravida nulla. Nulla vel metus scelerisque' +
                            ' ante sollicitudin commodo. Cras purus odio,' +
                            ' vestibulum in vulputate at, tempus viverra' +
                            ' turpis. Fusce condimentum nunc ac nisi' +
                            ' vulputate fringilla. Donec lacinia' +
                            ' congue felis in faucibus.',
                        user: user,
                        image:{},
                        videos: [
                            { title: " YouKu api",
                                link: 'XNjcwMDQwNjYw'}
                        ],
                        reading:"",
                        quizzes: []
                    });
                    if (count % 2) {
                        nodo.quizzes.push({quiz:quiz});
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

                    nodo.save(function (err) {

                        if (err) return console.log(err);
                        count--;
                        console.log('init nodo');
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
            Nodo.collection.remove(cb);
        },
        function (cb) {
            Quiz.collection.remove(cb);
        },
        function (cb) {
            Answer.collection.remove(cb);
        }

    ], done);
}

process.env.NODE_ENV = 'test'
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , should = require('should')
    , request = require('supertest')
    , app = require('../app')
    , context = describe
    , User = mongoose.model('User')
    , Article = mongoose.model('Article')
//    , Scorm = mongoose.model('Scorm')
    , Quiz = mongoose.model('Quiz')
    , agent = request.agent(app)

var count,article,user

/**
 * Scorm tests
 */

describe('Scorm ', function () {
    before(function (done) {
        // create a user
        user = new User({
            email: 'foobarTest@example.com',
            name: 'Foo bar',
            username: 'foobarTest',
            password: 'foobar'
        })
        user.save(function(err){
            article = new Article({
                title: 'foo bar',
                body: 'this is body',
                user: user
            })
            article.save(function(err){
                should.not.exist(err);
                if(err) console.log(err.message);
                done();
            })

        });

    })

    describe('GET a article id ', function () {

        before(function (done) {
            // login the user

            Article.findOne({}).exec(function (err, a) {

                article = a;
                done();
            });
        })
        it('should build scorm in file system @fast ', function (done) {
            agent
                .get('/scorm/'+article.id+'/build')
                .expect(200)
                .end(done)
        })

    })
})
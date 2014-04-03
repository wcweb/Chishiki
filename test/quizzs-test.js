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
    , agent = request.agent(app)

var count,article

/**
 * Quizzes tests
 */

describe('Quizzes', function () {
    before(function (done) {
        require('./helpers/models-helper').fakeDb(done)
    })

    describe('GET /articles/new', function () {
        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'foobar2@example.com')
                    .field('password', 'foobar')
                    .end(function(){
                        article = Article.findOne({});
                    })
            })

            it('should save the article to the database', function (done) {
                agent
                    .get('/articles/'+article.id+'/edit')
                    .click('.crud-quiz-control button')
                    .expect(200);
            })

        })
    })

    after(function (done) {
        require('./helpers/models-helper').clearDb(done)
    })
})
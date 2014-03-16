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


describe('Models test : ', function(){
    var user;
    before(function (done) {
        // create a user
        user = new User({
            email: 'foobarTest@example.com',
            name: 'Foo bar',
            username: 'foobarTest',
            password: 'foobar'
        })
        user.save(function(err){
            User.findOne({ username : user.username}, function(err,_user){
                if(err) console.log(err.message);
            })
            done();
        });

    })

    context('create a article', function(){
        var article;
        before(function(){
            article = new Article({
                title: 'foo bar',
                body: 'this is body',
                user: user
            })
            article.save(function(err){
                if(err) console.log(err.message);
            })
        })

        it('insert comments', function(){
            article.comments.push({body:'fuck', user: user})
            article.save(function(err){
                if(err) console.log(err.message);
            })
        })

        it('insert quiz', function(){
            var answers = [];
            answers.push({option:" this option a ", correct:false});
            answers.push({option:" this option b ", correct:false});
            answers.push({option:" this option c ", correct:true});
            var question ={
                question:"this is a question",
                answers:answers,
                correct:" correct  ",
                incorrect:" incorrect keep going on."
            }
            article.quizs.push(question);
            article.save(function(err){
                if(err) console.log(err.message);
            })

        })

        describe('user', function(){
            it('should get his article', function(done){
                Article
                    .findOne({ user: user})
                    .populate('user')
                    .exec(function (err, article) {
                        should.not.exist(err)
                        article.should.be.an.instanceOf(Article)
                        article.title.should.equal('foo bar')
                        article.body.should.equal('this is body')
                        article.user.email.should.equal('foobarTest@example.com')
                        article.user.name.should.equal('Foo bar')
                        done()
                    })
            })
        })



    })

    after(function (done) {
        require('./helpers/models-helper').clearDb(done)
    })
})

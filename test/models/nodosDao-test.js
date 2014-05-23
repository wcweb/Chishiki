process.env.NODE_ENV = 'test'

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , should = require('should')
    , request = require('supertest')
    , app = require('../../app')
    , context = describe
    , User = mongoose.model('User')
    , Nodo = mongoose.model('Nodo')
    , agent = request.agent(app)


describe('Nodo Models test : ', function(){
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
                user = _user;
            })
            done();
        });

    })

    context('create a nodo', function(){
        var nodo;
        before(function(){
            nodo = new Nodo({
                title: 'foo foo bar',
                body: 'this is body',
                user: user
            })
            nodo.save(function(err){
                if(err) console.log(err.message);
            })
        })

        it('insert comments', function(){
            nodo.comments.push({body:'fuck', user: user})
            nodo.save(function(err){
                if(err) throw err;
                nodo.comments[0].body.should.equal('fuck');
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
            nodo.quizzes.push(question);
            nodo.save(function(err){
                if(err) console.log(err.message);
                nodo.quizzes.length.should.equal(1);
            })


        })

        describe('user', function(){
            it('should get his nodo', function(done){
                Nodo
                    .findOne({ user: user})
                    .populate('user')
                    .exec(function (err, nodo) {
                        should.not.exist(err)
                        nodo.should.be.an.instanceOf(Nodo)
                        nodo.title.should.equal('foo foo bar')
                        nodo.body.should.equal('this is body')
                        nodo.user.should.be.an.instanceOf(User)
                        nodo.user.email.should.equal('foobarTest@example.com')
                        nodo.user.name.should.equal('Foo bar')
                        done()
                    })
            })

            it('should get list nodo group by user', function(done){
                User
                    .find({})
                    .exec(function(err,users){
                        Nodo.find()
                            .populate('user', 'name email username')
                            .exec(function(err,nodos){
                                var nodo, usr, results=[];
                                for(var i=0; i< nodos.length; i++){
                                    nodo = nodos[i];

                                    (function(){
                                        for(var j=0; j< users.length; j++){
                                            usr= users[j];
                                            if( nodo.user.name == usr.name ){
                                                var userNodo = {}
                                                userNodo = usr;
                                                userNodo['nodos']=[];
                                                userNodo['nodos'].push(nodo);
                                                results.push(userNodo);
                                            }
                                        }
                                    })();
                                }
                                should.not.exist(err);
                                for(var j=0; j< users.length; j++){
                                    results[j].nodos[0].should.be.an.instanceOf(Nodo);
                                }
                                done();
                            });


                    });
            })
        })



    })

    after(function (done) {
        require('../helpers/models-helper').clearDb(done)
    })
})

process.env.NODE_ENV='test'
var app = require('../../app');
var should = require('should')
    , request = require('supertest')
    , agent = request(app)
    , mongoose = require('mongoose')
    , User = mongoose.model('User');

var cookies, count;

describe('routes',function(){


    //after(function (done) {
        //require('./helpers/models-helper').clearDb(done);
    //});
    describe('Valid parameters', function(){
        before( function (done){
            User.count(function(err, cnt){
                count = cnt;
                done();
            })
        });
        it('should redirect to /articles', function(done){
            request(app)
                .post('/users')
                .field('name', 'Foo bar')
                .field('username', 'foobar')
                .field('email', 'foobar@example.com')
                .field('password', 'foobar')
                .field('role','member')
                .expect('Content-Type', /plain/)
                .expect(302)
                .expect(/Moved Temporarily/)
                .end(done)
        })

        it('should insert a record to the database', function(done){
            User.count(function (err, cnt){
                cnt.should.equal(count + 1);
                done();
            });
        })

        it('should save the user to the database', function(done){
            User.findOne({ username: 'foobar' }).exec(function(err,user){
                should.not.exist(err);
                user.should.be.an.instanceOf(User);
                user.email.should.equal('foobar@example.com');
                done();
            })
        })

    })
})


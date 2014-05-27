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

var cookies, count

/**
 * Users tests
 */

describe('Users', function () {
    describe('POST /users', function () {
        describe('Invalid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt
                    done()
                })
            })

            it('no email - should respond with errors', function (done) {
                request(app)
                    .post('/users')
                    .field('name', 'Foo bar')
                    .field('username', 'foobar')
                    .field('email', '')
                    .field('password', 'foobar')
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect(/Email cannot be blank/)
                    .end(done)
            })

            it('no name - should respond with errors', function (done) {
                request(app)
                    .post('/users')
                    .field('name', '')
                    .field('username', 'foobar')
                    .field('email', 'foobar@example.com')
                    .field('password', 'foobar')
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect(/Name cannot be blank/)
                    .end(done)
            })

            it('should not save the user to the database', function (done) {
                User.count(function (err, cnt) {
                    count.should.equal(cnt)
                    done()
                })
            })
        })

        describe('Valid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt
                    done()
                })
            })

            it('should redirect to /', function (done) {
                request(app)
                    .post('/users')
                    .field('name', 'Foo bar2')
                    .field('username', 'foobar2')
                    .field('email', 'foobar2@example.com')
                    .field('password', 'foobar')
                    .expect('Content-Type', /plain/)
                    .expect('Location', /\//)
                    .expect(302)
                    .expect(/Moved Temporarily/)
                    //.expect(200)
                    .end(done)
            })

            it('should insert a record to the database', function (done) {
                User.count(function (err, cnt) {
                    cnt.should.equal(count + 1)
                    done()
                })
            })

            it('should save the user to the database', function (done) {
                User.findOne({ username: 'foobar2' }).exec(function (err, user) {
                    should.not.exist(err)
                    user.should.be.an.instanceOf(User)
                    user.email.should.equal('foobar2@example.com')
                    done()
                })
            })
            it('should show the user on user/show page with username', function(done){
              request(app)
                    .get('/users/'+'foobar2')
                    .expect(200)
                    .expect(/Foo bar2/)
                    .end(done);
            })

            it('should show the user on user/show page with name', function(done){
              request(app)
                    .get('/users/'+'Foo bar2')
                    .expect(200)
                    .expect(/Foo bar2/)
                    .end(done);
            })
        })
    })

    after(function (done) {
        require('../helpers/models-helper').clearDb(done)
    })
})

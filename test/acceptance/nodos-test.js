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

var count

/**
 * Nodos tests
 */

describe('Nodos', function () {
    before(function (done) {

            // create a user
            var user = new User({
                email: 'foobar2@example.com',
                name: 'Foo bar',
                username: 'foobar',
                password: 'foobar'
            })
            user.save(done);
            
    })

    describe('GET /nodos', function () {
        it('should respond with Content-Type text/html', function (done) {
            agent
                .get('/nodos')
                .expect('Content-Type', /html/)
                .expect(200)

                .end(done)
        })
    })

    describe('GET /nodos/new', function () {
        context('When not logged in', function () {
            it('should redirect to /login', function (done) {
                agent
                    .get('/nodos/new')
                    .expect('Content-Type', /plain/)
                    .expect(302)
                    .expect('Location', '/login')
                    .expect(/Moved Temporarily/)
                    .end(done)
            })
        })

        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'foobar2@example.com')
                    .field('password', 'foobar')
                    .end(done)
            })

            it('should respond with Content-Type text/html', function (done) {
                agent
                    .get('/nodos/new')
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect(/New Nodo/)
                    .end(done)
            })
        })
    })

    describe('POST /nodos', function () {
        context('When not logged in', function () {
            it('should redirect to /login', function (done) {
                request(app)
                    .get('/nodos/new')
                    .expect('Content-Type', /plain/)
                    .expect(302)
                    .expect('Location', '/login')
                    .expect(/Moved Temporarily/)
                    .end(done)
            })
        })

        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'foobar2@example.com')
                    .field('password', 'foobar')
                    .end(done)
            })

            describe('Invalid parameters', function () {
                before(function (done) {
                    Nodo.count(function (err, cnt) {
                        count = cnt
                        done()
                    })
                })

                it('should respond with error', function (done) {
                    agent
                        .post('/nodos')
                        .field('title', '')
                        .field('body', 'foo')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/Nodo title cannot be blank/)
                        .end(done)
                })

                it('should not save to the database', function (done) {
                    Nodo.count(function (err, cnt) {
                        count.should.equal(cnt)
                        done()
                    })
                })
            })

            describe('Valid parameters', function () {
                before(function (done) {
                    Nodo.count(function (err, cnt) {
                        count = cnt
                        done()
                    })
                })

                it('should redirect to the new nodo page', function (done) {
                    agent
                        .post('/nodos')
                        .field('title', 'foo')
                        .field('body', 'bar')
                        .expect('Content-Type', /plain/)
                        .expect('Location', /\/nodos\//)
                        .expect(302)
                        .expect(/Moved Temporarily/)
                        .end(done)
                })

                it('should insert a record to the database', function (done) {
                    Nodo.count(function (err, cnt) {
                        cnt.should.equal(count + 1)
                        done()
                    })
                })

                it('should save the nodo to the database', function (done) {
                    Nodo
                        .findOne({ title: 'foo'})
                        .populate('user')
                        .exec(function (err, nodo) {
                            should.not.exist(err)
                            nodo.should.be.an.instanceOf(Nodo)
                            nodo.title.should.equal('foo')
                            nodo.body.should.equal('bar')
                            nodo.user.email.should.equal('foobar2@example.com')
                            nodo.user.name.should.equal('Foo bar')
                            done()
                        })
                })
                describe('should update the nodo to the database', function () {

                })
            })
        })
    })

    after(function (done) {
        require('../helpers/models-helper').clearDb(done)
    })
})

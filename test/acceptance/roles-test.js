process.env.NODE_ENV='test'
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

describe('Roles test:', function () {
    before(function (done) {

            // create a user
            var user = new User({
                email: 'member@example.com',
                name: 'Foo bar',
                username: 'foobar member',
                password: 'member',
                role: 'member'
            })
            user.save(function(err,user){
                var admin = new User({
                    email: 'admin@example.com',
                    name: 'Foo bar admin',
                    username: 'admin',
                    password: 'admin',
                    role: 'admin'
                })
                admin.save(done);
            })


    })

    describe('anonymous :', function () {
        it('should respond with 403', function (done) {
            agent
                .get('/dashboard/index')
                .expect(403)
                .end(done)
        })
    })



    describe('Member :', function () {


        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'member@example.com')
                    .field('password', 'member')
                    .end(done)
            })



            describe('access dashboard  ', function () {

                it('should respond with Authenticated', function(done){
                    agent
                        .get('/nodos/new')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/New Nodo/)
                        .end(done)
                })
                it('should access member page', function (done) {
                    agent
                        .get('/dashboard/index')
                        .expect(200)
                        .end(done)
                })
                it('should not access admin page', function (done) {
                    agent
                        .get('/dashboard/admin')
                        .expect(403)
                        .end(done)
                })

            })
        })

    })


    describe('admin :', function () {
        before(function (done) {
            // login the user
            agent
                .post('/users/session')
                .field('email', 'admin@example.com')
                .field('password', 'admin')
                .end(done)
        })



        describe('access dashboard  ', function () {


            it('should access member page', function (done) {
                agent
                    .get('/dashboard/index')
                    .expect(200)
                    .end(done)
            })
            it('should not access admin page', function (done) {
                agent
                    .get('/dashboard/admin')
                    .expect(200)
                    .end(done)
            })

        })
    })

    after(function (done) {
        require('../helpers/models-helper').clearDb(done)
    })
})

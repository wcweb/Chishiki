process.env.NODE_ENV = 'test'
/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var mongoose = require('mongoose')
    , should = require('should')
    , request = require('supertest')
    , app = require('../app')
    , context = describe
    , User = mongoose.model('User')
    , Nodo = mongoose.model('Nodo')
//    , Scorm = mongoose.model('Scorm')
    , Quiz = mongoose.model('Quiz')
    , agent = request.agent(app)
    , fsHelper = require('../lib/helpers/fs-helper');

var count,nodo,user;

/**
 * Scorm tests
 */

describe('Scorm @fast', function () {
    before(function (done) {
        // create a user
        user = new User({
            email: 'foobarTest@example.com',
            name: 'Foo bar',
            username: 'foobarTest',
            password: 'foobar'
        })
        user.save(function(err){
            nodo = new Nodo({
                title: 'foo bar',
                body: 'this is body',
                user: user
            })
            nodo.save(function(err){
                should.not.exist(err);
                if(err) console.log(err.message);
                done();
            })

        });

    })

    describe('GET a nodo id ', function () {

        before(function (done) {
            // login the user

            Nodo.findOne({}).exec(function (err, a) {

                nodo = a;
                fsHelper.emptyFolder( config.SCORM_Directory, function(){
                  if(err) throw err;
                  done();
                });
            });

        })
        it('should build scorm in file system  ', function (done) {
            agent
                .get('/scorm/'+nodo.id+'/build')
                .expect(200)
                .end(done)
        })
        it('should exportSCORM scorm in file system  ', function (done) {
            agent
                .get('/scorm/'+nodo.id+'/exportSCORM')
                .expect(200)
                .end(function(err,res){
                    done();
                })
        })
    })
})

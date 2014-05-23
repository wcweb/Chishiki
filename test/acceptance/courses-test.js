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

describe('Course', function () {
  before(function (done) {

      // create a user
      var user = new User({
          email: 'foobar2@example.com',
          name: 'Foo bar',
          username: 'foobar',
          password: 'foobar'
      })
      user.save(
        // login the user
        agent
            .post('/users/session')
            .field('email', 'foobar2@example.com')
            .field('password', 'foobar')
            .end(done)
      );
  })

  describe('Add Nodos', function(done){
    it('should update sort index ', function(done){
      agent.get('/').expect(200).end(done)
    })
  })





  after(function (done) {
      require('../helpers/models-helper').clearDb(done)
  })

})

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
    , Category = mongoose.model('Category')


describe('Model Category test : @fast', function(){

  var category, catCLen=0;
  before(function(done){
    category = new Category({
      title: ' Category 1 ',
      body: 'descriptons ...',
      children:[],
      parent:null
    })

    category.save(function(err){
      done();
    });

  })

  it('should be instant of Model Category', function(){
    category.should.be.an.instanceOf(Category)
  })

  context('CRUD node', function(){
    it('should be add node', function(){
      category.addChild({
        title: ' Category Child 1',
      }, function(err){
        catCLen += 1;
        category.children.length.should.equal(
          catCLen);
      })
    })

    it('should be able to remove exist node', function(){
      category.removeChild({
        title: ' Category Child 1',
      }, function(err){
        catCLen -=1;
        category.children.length.should.equal(
          catCLen);
      })
    })
  })



})

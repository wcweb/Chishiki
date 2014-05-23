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
      label: ' Category 1 ',
      description: 'descriptons ...',
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

  context('CRUD Child', function(){
    it('should be add node', function(){
      category.addChild({
        label: ' Category Child 1',
      }, function(err){
        catCLen += 1;
        category.children.length.should.equal(
          catCLen);
          Category.getChildren(category._id,function(err, subcats){
            subcats.length.should.equal(catCLen);
          })
      })
    })

    it('should be able to remove exist node', function(){
      category.removeChild({
        label: ' Category Child 1',
      }, function(err){
        catCLen -=1;
        category.children.length.should.equal(
          catCLen);
      })
    })
  })




})

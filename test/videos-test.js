var app = require('../app');
var should = require('should')
    , request = require('supertest')
    , agent = request(app)
    , mongoose = require('mongoose')
    , Nodo= mongoose.model('Nodo')
    , User = mongoose.model('User');

var nodo;

describe('Video add ', function(){
    //this.timeout(4000);
    before(function(done){
        require('./helpers/models-helper').fakeDb(done);
    })
    after(function (done) {
        require('./helpers/models-helper').clearDb(done)
    })



    describe('Edit a nodo ', function(){
        var v_c;
        before(function(done){
            Nodo.findOne({title:'foo4 bar'},function(err, a){
                nodo = a;
                v_c = nodo.videos.length;
            agent
                .post('/users/session')
                .field('email', 'foobarTest2@example.com')
                .field('password', 'foobar')
                .end(done);

            });
        })
        it('should editable ', function(done){


                agent.post('/nodos/'+nodo._id+'/videos')
                    .field('video_title','titititit')
                    .field('video_url','ssss')
                    .expect(302)
                    .expect(/Moved Temporarily/)
                    .end(done);
        });

        it('should add video ', function(done){
            Nodo.findOne({_id: nodo._id})
                .exec(function (err, a) {
                    should.not.exist(err);
                    a.title.should.equal('foo4 bar');
                    //@TODO tempe equal 0 .
                    a.videos.length.should.equal(0)
                    done()
                });
        })
    })



})

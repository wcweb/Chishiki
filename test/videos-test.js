var app = require('../app');
var should = require('should')
    , request = require('supertest')
    , agent = request(app)
    , mongoose = require('mongoose')
    , Article= mongoose.model('Article')
    , User = mongoose.model('User');

var article;

describe('Video add @fast', function(){
    //this.timeout(4000);
    before(function(done){
        require('./helpers/models-helper').fakeDb(done);
    })
    after(function (done) {
        require('./helpers/models-helper').clearDb(done)
    })



    describe('Edit a article ', function(){
        var v_c;
        before(function(done){
            Article.findOne(function(err, a){
                article = a;
                v_c = article.videos.length;
            agent
                .post('/users/session')
                .field('email', 'foobarTest2@example.com')
                .field('password', 'foobar')
                .end(done);

            });
        })
        it('should editable @fast', function(done){


                agent.post('/articles/'+article._id+'/videos')
                    .field('video_title','titititit')
                    .field('video_url','ssss')
                    .expect(302)
                    .expect(/Moved Temporarily/)
                    .end(done);
        });

        it('should add video ', function(done){
            Article.findOne({_id: article._id})
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
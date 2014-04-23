process.env.NODE_ENV = 'test'
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , should = require('should')
    , request = require('supertest')
    , app = require('../app')
    , context = describe
    , User = mongoose.model('User')
    , Nodo = mongoose.model('Nodo')
    , Quiz = mongoose.model('Quiz')
    , agent = request.agent(app)

var count,nodo,user

/**
 * Quizzes tests
 */

describe('Quizzes ', function () {
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
                        done();
                });
            })

            it('should post the nodo with quizzes  ', function (done) {

                //console.log(JSON.parse(ReqestString));

                nodo.should.be.an.instanceOf(Nodo);
                agent
                    .get('/nodos/'+nodo.id+'/quizzes/?'+ReqestString)
//                    .type('json')
//                    .send(ReqestString)
                    //.field('quizzes',ReqestString)
                    .expect(200)
                    .end(function(err, res){
                        if (err) {
                            //console.dir(res);
                            throw err;
                        }

                        done();
                    });

            })


            it('should save the nodo to the database ', function (done) {

                //console.log(JSON.parse(ReqestString));
                Nodo.findOne({ _id : nodo.id })
                    .populate('user')
                    .populate('quizzes.quiz')

                    .exec(function (err, a){
                       should.not.exist(err);
                      //  console.log("nodo is " + a);
                       if(a){
                           a.should.be.an.instanceOf(Nodo);
                           a.quizzes.length.should.equal(1);
                           //console.log(a.quizzes[0].quiz.questions);
                           a.quizzes[0].quiz.should.be.an.instanceOf(Quiz);
                           a.quizzes[0].quiz.questions.length.should.equal(4);
                       }else{
                           console.log(err);
                       }

                       done();
                   })

            })
            context(' get exist nodo with quizz', function(){
              before(function(done){
                Nodo.findOne({_id :nodo.id})
                    .populate('quizzes.quiz')
                    .exec(function(err, n){
                      if(err) throw err;
                      nodo = n;
                      done();
                    })
              })
              it('should update  quizzes  ', function (done) {
                  //console.log(nodo);
                  var quiz = nodo.quizzes[0];
                  quiz.quiz.should.be.an.instanceOf(Quiz);
                  agent
                      .put('/nodos/'+nodo.id+'/quizzes/'+quiz.quiz.id)
                      .send(ReqestString)
                      .expect(200)
                      .end(function(err, res){
                          if (err) {
                              throw err;
                          }
                          done();
                      });

              })
            })
    })

    after(function (done) {
        require('./helpers/models-helper').clearDb(done)
    })
})




var ReqestString ='_csrf=Fwe9txML2UyHEJl93sDknj04%2FI4SOY5%2B2MmvQ%3D&qu' +
'izzes%5B0%5D%5Bquestion%5D=%E7%94%B7%E6%80%A7330303030%2C50%E5%B2%81%2C%E5%86%9C%E6%B0%9' +
    '1%2C%E4%BB%A5%E8%A1%B0%E5%BC%B1%E3%80%81%E6%B0%94%E4%BF%83%E3%80%81%E8%BD%BB%E5%BA%A6%E5' +
    '%B9%B2%E5%92%B38%E4%B8%AA%E6%9C%88%E5%85%A5%E9%99%A2%E3%80%82%E4%BD%93%E6%A3%80%3A%E5%91' +
    '%BC%E5%90%B828%E6%AC%A1%2F%E5%88%86%2C%E4%B8%A4%E8%82%BA%E5%BA%95%E9%97%BB%E7%88%86%E8%A' +
    '3%82%E9%9F%B3(Velcro%E7%BD%97%E9%9F%B3)%2C%E6%9C%89%E6%9D%B5%E7%8A%B6%E6%8C%87%2C%E8%83%' +
    'B8%E9%83%A8X%E7%BA%BF%3A%E4%B8%A4%E8%82%BA%E4%B8%AD%E4%B8%8B%E9%87%8E%E5%BC%A5%E6%BC%AB%' +
    'E6%80%A7%E7%BD%91%E7%8A%B6%E5%BD%B1%2C%E8%82%BA%E5%8A%9F%E8%83%BD%E7%A4%BA%E9%99%90%E5%8' +
    '8%B6%E6%80%A7%E9%80%9A%E6%B0%94%E9%9A%9C%E7%A2%8D%2C%E6%9C%80%E5%8F%AF%E8%83%BD%E7%9A%84' +
    '%E8%AF%8A%E6%96%AD%E6%98%AF%0D%0A++++++++++++++++++++++++++++&quizzes%5B0%5D%5Banswers%5' +
    'D%5B0%5D%5Boption%5D=A.%E6%85%A2%E6%80%A7%E6%94%AF%E6%B0%94%E7%AE%A1%E7%82%8E&quizzes%5B' +
    '0%5D%5Banswers%5D%5B1%5D%5Boption%5D=B.%E7%89%B9%E5%8F%91%E6%80%A7%E8%82%BA%E9%97%B4%E8%' +
    'B4%A8%E7%BA%A4%E7%BB%B4%E5%8C%96&quizzes%5B0%5D%5Banswers%5D%5B1%5D%5Bcorrect%5D=on&quiz' +
    'zes%5B0%5D%5Banswers%5D%5B2%5D%5Boption%5D=C.%E6%94%AF%E6%B0%94%E7%AE%A1%E6%89%A9%E5%BC%' +
    'A0%E7%97%87&quizzes%5B0%5D%5Banswers%5D%5B3%5D%5Boption%5D=D.%E5%BF%83%E5%8A%9B%E8%A1%B0' +
    '%E7%AB%AD&quizzes%5B0%5D%5Banswers%5D%5B4%5D%5Boption%5D=E.%E7%9F%BD%E8%82%BA&quizzes%5B' +
    '0%5D%5Bcorrect%5D=%3Cp%3E+%E7%AD%94%E6%A1%88%EF%BC%9AB+%3Cspan%3E%E6%82%A8%E7%AD%94%E5%A' +
    'F%B9%E4%BA%86%EF%BC%81%3C%2Fspan%3E+%E8%A6%81%E8%AE%B0%E4%BD%8F%E8%82%BA%E7%BA%A4%E7%BB%' +
    'B4%E5%8C%96%EF%BC%9A%E8%82%BA%E5%8A%9F%E8%83%BD%E6%8F%90%E7%A4%BA%E7%9A%84%E6%98%AF%E9%9' +
    '9%90%E5%88%B6%E6%80%A7%E9%80%9A%E6%B0%94%E9%9A%9C%E7%A2%8D%E3%80%82%E6%9F%A5%E4%BD%93%E9' +
    '%80%9A%E5%B8%B8%E6%9C%89%E6%9D%B5%E7%8A%B6%E6%8C%87%E3%80%82%3C%2Fp%3E%0D%0A++++++++++++' +
    '++++++++++++++++&quizzes%5B0%5D%5Bincorrect%5D=%3Cp%3E%E7%AD%94%E6%A1%88%EF%BC%9AB+%3Csp' +
    'an%3E%E6%8A%B1%E6%AD%89%EF%BC%8C%E7%AD%94%E9%94%99%E4%BA%86%E3%80%82%3C%2Fspan%3E+%E8%A7' +
    '%81%E5%88%B0%E4%B8%A4%E8%82%BA%E5%BA%95%E9%97%BB%E7%88%86%E8%A3%82%E9%9F%B3(Velcro%E7%BD' +
    '%97%E9%9F%B3)%E6%88%96%E8%A7%81%E5%88%B0%E8%83%B8%E9%83%A8X%E7%BA%BF%3A%E4%B8%A4%E8%82%B' +
    'A%E4%B8%AD%E4%B8%8B%E9%87%8E%E5%BC%A5%E6%BC%AB%E6%80%A7%E7%BD%91%E7%8A%B6%E5%BD%B1%E5%B0' +
    '%B1%E6%98%AF%E8%82%BA%E7%BA%A4%E7%BB%B4%E5%8C%96%EF%BC%9B%3C%2Fp%3E%0D%0A+++++++++++++++' +
    '+++++++++++++&quizzes%5B1%5D%5Bquestion%5D=%E6%94%AF%E6%B0%94%E7%AE%A1%E5%93%AE%E5%96%98' +
    '%E6%82%A3%E8%80%85%E6%80%A5%E6%80%A7%E5%8F%91%E4%BD%9C5%E5%A4%A9%2C%E6%B5%8B%E5%8A%A8%E8' +
    '%84%89%E8%A1%80%E6%B0%94pH7.40%E3%80%81PaO%EE%80%916.67kPa(50mmHg)%2CPaCO%EE%80%918.0kPa' +
    '(60mmHg)%E3%80%81HCO%EE%80%92%EE%80%AA30mmol%2FL%EF%BC%8C%E6%9C%80%E5%8F%AF%E8%83%BD%E8%' +
    'A1%A8%E6%98%8E%0D%0A++++++++++++++++++++++++++++&quizzes%5B1%5D%5Banswers%5D%5B0%5D%5Bop' +
    'tion%5D=A.%E7%97%85%E6%83%85%E5%A5%BD%E8%BD%AC&quizzes%5B1%5D%5Banswers%5D%5B1%5D%5Bopti' +
    'on%5D=B.%E6%B2%A1%E6%9C%89%E4%B8%B4%E5%BA%8A%E6%84%8F%E4%B9%89&quizzes%5B1%5D%5Banswers%' +
    '5D%5B1%5D%5Bcorrect%5D=on&quizzes%5B1%5D%5Banswers%5D%5B2%5D%5Boption%5D=C.%E8%BD%BB%E5%' +
    'BA%A6%E5%8F%91%E4%BD%9C&quizzes%5B1%5D%5Banswers%5D%5B3%5D%5Boption%5D=D.%E7%97%85%E6%83' +
    '%85%E4%B8%A5%E9%87%8D%2C%E9%A1%BB%E7%A7%AF%E6%9E%81%E6%B2%BB%E7%96%97&quizzes%5B1%5D%5Ba' +
    'nswers%5D%5B3%5D%5Bcorrect%5D=on&quizzes%5B1%5D%5Banswers%5D%5B4%5D%5Boption%5D=E.%E6%9C' +
    '%89%E5%BF%83%E8%A1%80%E7%AE%A1%E5%B9%B6%E5%8F%91%E7%97%87&quizzes%5B1%5D%5Bcorrect%5D=%3' +
    'Cp%3E%E7%AD%94%E6%A1%88%EF%BC%9AD+%3Cspan%3E%E6%82%A8%E7%AD%94%E5%AF%B9%E4%BA%86%EF%BC%8' +
    '1!%3C%2Fspan%3E+%3Cspan%3E%E5%88%86%E6%9E%90%EF%BC%9A%3C%2Fspan%3E%3Cbr+%2F%3E++++++++++' +
    '+++++++++++++++%E6%94%AF%E6%B0%94%E7%AE%A1%E5%93%AE%E5%96%98%E5%8F%91%E4%BD%9C%E6%97%B6%' +
    'E6%98%AF%E5%91%BC%E6%B0%94%E6%80%A7%E5%91%BC%E5%90%B8%E5%9B%B0%E9%9A%BE%EF%BC%8C%E8%A1%8' +
    '0%E6%B0%94%E5%88%86%E6%9E%90%E5%B8%B8%E5%B8%B8%E6%98%AF%EF%BC%9A%E5%91%BC%E5%90%B8%E6%80' +
    '%A7%E7%A2%B1%E4%B8%AD%E6%AF%92%E3%80%82+++++++++++++++++++++++++%E9%A2%98%E5%B9%B2%E5%87' +
    '%BA%E7%8E%B0%E5%93%AE%E5%96%98%E5%8F%91%E4%BD%9C5%E5%A4%A9%EF%BC%8C%E6%8F%90%E7%A4%BA%E6' +
    '%98%AF%E9%87%8D%E7%97%87%E5%93%AE%E5%96%98%E3%80%82%EF%BC%88%E5%93%AE%E5%96%98%E6%8C%81%' +
    'E7%BB%AD%E7%8A%B6%E6%80%81%E5%8F%AF%E6%8C%81%E7%BB%AD1-2%E5%A4%A9%EF%BC%8C%E5%8F%88%E7%A' +
    '7%B0%E4%B8%BA%E9%87%8D%E7%97%87%E5%93%AE%E5%96%98%EF%BC%9B%E6%AF%8F%E5%88%86%E9%92%9F%E5' +
    '%91%BC%E5%90%B828%E6%AC%A1%2F%E5%88%86%EF%BC%8CP%E5%A4%A7%E4%BA%8E110%E6%AC%A1%2F%E5%88%' +
    '86%E3%80%82%E5%8F%AF%E5%87%BA%E7%8E%B0%E5%91%BC%E5%90%B8%E6%9C%BA%E7%96%B2%E5%8A%B3%EF%B' +
    'C%8C%E5%87%BA%E7%8E%B0%E5%A5%87%E8%84%89%EF%BC%8C%E8%A1%80%E5%8E%8B%E4%B8%8B%E9%99%8D%E3' +
    '%80%81%E5%A4%A7%E6%B1%97%E6%B7%8B%E6%BC%93%E3%80%81%E4%B8%A5%E9%87%8D%E8%84%B1%E6%B0%B4%' +
    'E3%80%81%E7%A5%9E%E5%BF%97%E6%A8%A1%E7%B3%8A%E3%80%82%E5%87%BA%E7%8E%B0%E5%91%BC%E5%90%B' +
    '8%E6%80%A7%E9%85%B8%E4%B8%AD%E6%AF%92%EF%BC%8C%E8%8B%A5%E7%BC%BA%E6%B0%A7%E6%98%8E%E6%98' +
    '%BE%E5%8F%AF%E5%90%88%E5%B9%B6%E4%BB%A3%E8%B0%A2%E6%80%A7%E9%85%B8%E4%B8%AD%E6%AF%92%EF%' +
    'BC%89++++++++++++++++++++++++%E9%A2%98%E5%B9%B2%E6%8F%90%E7%A4%BA%EF%BC%9A%E5%87%BA%E7%8' +
    'E%B0PaCO%EE%80%91%E6%BD%B4%E7%95%99%EF%BC%8C%E8%AF%B4%E6%98%8E%E6%98%AF%E9%87%8D%E7%97%8' +
    '7%E5%93%AE%E5%96%98%E3%80%82++++++++++++++++++++++++%E7%BB%BC%E4%B8%8A%E6%89%80%E8%BF%B0' +
    '%E6%98%AFD%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++&quizzes%5B1%5D%5Bincorrect%5D=%3C' +
    'p%3E%E7%AD%94%E6%A1%88%EF%BC%9AD+%3Cspan%3E%E6%8A%B1%E6%AD%89%EF%BC%8C%E7%AD%94%E9%94%99' +
    '%E4%BA%86%E3%80%82.%3C%2Fspan%3E+%3Cbr+%2F%3E+++++++++++++++++++++++++%3Cspan%3E%E5%88%8' +
    '6%E6%9E%90%EF%BC%9A%3C%2Fspan%3E%3Cbr+%2F%3E+++++++++++++++++++++++++%E6%94%AF%E6%B0%94%' +
    'E7%AE%A1%E5%93%AE%E5%96%98%E5%8F%91%E4%BD%9C%E6%97%B6%E6%98%AF%E5%91%BC%E6%B0%94%E6%80%A' +
    '7%E5%91%BC%E5%90%B8%E5%9B%B0%E9%9A%BE%EF%BC%8C%E8%A1%80%E6%B0%94%E5%88%86%E6%9E%90%E5%B8' +
    '%B8%E5%B8%B8%E6%98%AF%EF%BC%9A%E5%91%BC%E5%90%B8%E6%80%A7%E7%A2%B1%E4%B8%AD%E6%AF%92%E3%' +
    '80%82+++++++++++++++++++++++++%E9%A2%98%E5%B9%B2%E5%87%BA%E7%8E%B0%E5%93%AE%E5%96%98%E5%' +
    '8F%91%E4%BD%9C5%E5%A4%A9%EF%BC%8C%E6%8F%90%E7%A4%BA%E6%98%AF%E9%87%8D%E7%97%87%E5%93%AE%' +
    'E5%96%98%E3%80%82%EF%BC%88%E5%93%AE%E5%96%98%E6%8C%81%E7%BB%AD%E7%8A%B6%E6%80%81%E5%8F%A' +
    'F%E6%8C%81%E7%BB%AD1-2%E5%A4%A9%EF%BC%8C%E5%8F%88%E7%A7%B0%E4%B8%BA%E9%87%8D%E7%97%87%E5' +
    '%93%AE%E5%96%98%EF%BC%9B%E6%AF%8F%E5%88%86%E9%92%9F%E5%91%BC%E5%90%B828%E6%AC%A1%2F%E5%8' +
    '8%86%EF%BC%8CP%E5%A4%A7%E4%BA%8E110%E6%AC%A1%2F%E5%88%86%E3%80%82%E5%8F%AF%E5%87%BA%E7%8' +
'E%B0%E5%91%BC%E5%90%B8%E6%9C%BA%E7%96%B2%E5%8A%B3%EF%BC%8C%E5%87%BA%E7%8E%B0%E5%A5%87%E8%84%89%EF%BC%8C%E8%A1%80%E5%8E%8B%E4%B8%8B%E9%99%8D%E3%80%81%E5%A4%A7%E6%B1%97%E6%B7%8B%E6%BC%93%E3%80%81%E4%B8%A5%E9%87%8D%E8%84%B1%E6%B0%B4%E3%80%81%E7%A5%9E%E5%BF%97%E6%A8%A1%E7%B3%8A%E3%80%82%E5%87%BA%E7%8E%B0%E5%91%BC%E5%90%B8%E6%80%A7%E9%85%B8%E4%B8%AD%E6%AF%92%EF%BC%8C%E8%8B%A5%E7%BC%BA%E6%B0%A7%E6%98%8E%E6%98%BE%E5%8F%AF%E5%90%88%E5%B9%B6%E4%BB%A3%E8%B0%A2%E6%80%A7%E9%85%B8%E4%B8%AD%E6%AF%92%EF%BC%89++++++++++++++++++++++++%E9%A2%98%E5%B9%B2%E6%8F%90%E7%A4%BA%EF%BC%9A%E5%87%BA%E7%8E%B0PaCO%EE%80%91%E6%BD%B4%E7%95%99%EF%BC%8C%E8%AF%B4%E6%98%8E%E6%98%AF%E9%87%8D%E7%97%87%E5%93%AE%E5%96%98%E3%80%82++++++++++++++++++++++++%E7%BB%BC%E4%B8%8A%E6%89%80%E8%BF%B0%E6%98%AFD%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++&quizzes%5B2%5D%5Bquestion%5D=%E6%94%AF%E6%B0%94%E7%AE%A1%E5%93%AE%E5%96%98%E5%8F%91%E7%97%85%E7%9A%84%E6%9C%80%E4%B8%BB%E8%A6%81%E7%97%85%E7%90%86%E5%9F%BA%E7%A1%80%E6%98%AF.%0D%0A++++++++++++++++++++++++++++&quizzes%5B2%5D%5Banswers%5D%5B0%5D%5Boption%5D=%E6%B0%94%E9%81%93%E7%9A%84%E9%9D%9E%E7%89%B9%E5%BC%82%E6%80%A7%E7%82%8E%E7%97%87&quizzes%5B2%5D%5Banswers%5D%5B0%5D%5Bcorrect%5D=on&quizzes%5B2%5D%5Banswers%5D%5B1%5D%5Boption%5D=%E5%89%AF%E4%BA%A4%E6%84%9F%E7%A5%9E%E7%BB%8F%E5%85%B4%E5%A5%8B&quizzes%5B2%5D%5Banswers%5D%5B2%5D%5Boption%5D=%E7%BB%86%E8%8F%8C%E6%84%9F%E6%9F%93&quizzes%5B2%5D%5Banswers%5D%5B3%5D%5Boption%5D=%E6%94%AF%E6%B0%94%E7%AE%A1%E7%97%89%E6%8C%9B&quizzes%5B2%5D%5Bcorrect%5D=%3Cp%3E+%E7%AD%94%E6%A1%88%EF%BC%9AA+%3Cspan%3E%E6%82%A8%E7%AD%94%E5%AF%B9%E4%BA%86%EF%BC%81!%3C%2Fspan%3E+%E6%94%AF%E6%B0%94%E7%AE%A1%E5%93%AE%E5%96%98%E7%9A%84%E5%AE%9A%E4%B9%89%E5%B7%B2%E6%B6%B5%E7%9B%96%E4%BA%86%EF%BC%8C%E6%AD%BB%E8%AE%B0%E3%80%82%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++&quizzes%5B2%5D%5Bincorrect%5D=%3Cp%3E%E7%AD%94%E6%A1%88%EF%BC%9AA+%3Cspan%3E%E6%8A%B1%E6%AD%89%EF%BC%8C%E7%AD%94%E9%94%99%E4%BA%86%E3%80%82.%3C%2Fspan%3E+%E6%94%AF%E6%B0%94%E7%AE%A1%E5%93%AE%E5%96%98%E7%9A%84%E5%AE%9A%E4%B9%89%E5%B7%B2%E6%B6%B5%E7%9B%96%E4%BA%86%EF%BC%8C%E6%AD%BB%E8%AE%B0%E3%80%82%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++&quizzes%5B3%5D%5Bquestion%5D=%E7%94%B7%E6%80%A760%E5%B2%81%EF%BC%8C%E7%AA%81%E7%84%B6%E5%A4%9C%E9%97%B4%E5%8F%91%E4%BD%9C%E5%91%BC%E5%90%B8%E5%9B%B0%E9%9A%BE%EF%BC%8C%E6%9F%A5%E4%BD%93%EF%BC%9A%E5%8F%8C%E8%82%BA%E6%BB%A1%E5%B8%83%E5%91%BC%E6%B0%94%E6%80%A7%E5%93%AE%E9%B8%A3%E9%9F%B3%E3%80%82%E4%B8%8B%E9%9D%A2%E5%93%AA%E5%87%A0%E9%A1%B9%E5%AF%B9%E9%89%B4%E5%88%AB%E8%AF%8A%E6%96%AD%E6%9C%89%E6%84%8F%E4%B9%89%E3%80%82%0D%0A++++++++++++++++++++++++++++&quizzes%5B3%5D%5Banswers%5D%5B0%5D%5Boption%5D=A.%E8%A1%80%E6%B0%94%E5%88%86%E6%9E%90&quizzes%5B3%5D%5Banswers%5D%5B1%5D%5Boption%5D=B.%E8%B6%85%E5%A3%B0%E5%BF%83%E5%8A%A8%E5%9B%BE&quizzes%5B3%5D%5Banswers%5D%5B1%5D%5Bcorrect%5D=on&quizzes%5B3%5D%5Banswers%5D%5B2%5D%5Boption%5D=C.%E8%83%B8%E9%83%A8X%E7%BA%BF&quizzes%5B3%5D%5Banswers%5D%5B2%5D%5Bcorrect%5D=on&quizzes%5B3%5D%5Banswers%5D%5B3%5D%5Boption%5D=E.%E6%97%A2%E5%BE%80%E7%97%85%E5%8F%B2&quizzes%5B3%5D%5Banswers%5D%5B3%5D%5Bcorrect%5D=on&quizzes%5B3%5D%5Bcorrect%5D=%3Cp%3E%E7%AD%94%E6%A1%88%EF%BC%9AA%3Cspan%3E%E6%82%A8%E7%AD%94%E5%AF%B9%E4%BA%86%EF%BC%81!%3C%2Fspan%3E+%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++&quizzes%5B3%5D%5Bincorrect%5D=%3Cp%3E%E7%AD%94%E6%A1%88%EF%BC%9AA%3Cspan%3E%E6%8A%B1%E6%AD%89%EF%BC%8C%E7%AD%94%E9%94%99%E4%BA%86%E3%80%82.%3C%2Fspan%3E+%3C%2Fp%3E%0D%0A++++++++++++++++++++++++++++';

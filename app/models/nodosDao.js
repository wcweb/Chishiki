
var mongoose = require('mongoose');
var Imager = require('imager');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var imagerConfig = require(config.root + '/config/imager.js');
var Schema = mongoose.Schema;
var _= utils = require('../../lib/utils');
var Quiz = require('./quizzesDao');
var Answer = mongoose.model('Answer');
var Category = mongoose.model('Category');
var extend = require('util')._extend;
var mongoHelper = require('../../lib/helpers/mongo-helper');

var forms = require('forms-mongoose');
/**
 * Getters
 */

var getTags = function (tags) {
    return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
    return tags.split(',')
}


/**
 * Nodo Schema
 */

var NodoSchema = new Schema({
    title: {type : String, default : '', trim : true, forms: {all:{}}},
    body: {type : String, default : '', trim : true,
                forms:
                {all:
                  {widget:
                    forms.widgets.textarea(
                      {rows:3,
                        classes: ['input-with-feedback'] 
                      })}}},
    user: {type : Schema.ObjectId, ref : 'User'},
    reading: {type : String, default : '', trim : true, forms: {all:{}}},
    videos:[{
        title:{ type : String, default :''},
        link: { type : String, default :''}
    }],
    quizzes:[{quiz:{type: Schema.Types.ObjectId, ref : "Quiz"}}],
    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],
    tags: {type: [], get: getTags, set: setTags},
    categories: [{type: Schema.ObjectId, ref : 'Category' }],
    image: {
        cdnUri: String,
        files: [{type : String, default : '', trim : true}] 
    }
    ,createdAt  : {type : Date, default : Date.now}
    ,scorm: {type: Schema.Types.ObjectId, ref : "Scorm"}
    , frontpage:{type:Boolean ,default: false}
});


/**
 * Validations
 */

NodoSchema.path('title').required(true, 'Nodo title cannot be blank');
NodoSchema.path('body').required(true, 'Nodo body cannot be blank');


/**
 * Pre-remove hook
 */

NodoSchema.pre('remove', function (next) {
    var imager = new Imager(imagerConfig, 'Local');
    var files = this.image.files;

    // if there are files associated with the item, remove from the cloud too
    imager.remove(files, function (err) {
        if (err) return next(err)
    }, 'nodo');

    // @TODO remove video quiz discuss

    next();
});


/**
 * Methods
 */

NodoSchema.methods = {

    /**
     * Save nodo and upload image
     *
     * @param {Object} images
     * @param {Function} cb
     * @api private
     */

    uploadAndSave: function (images, cb) {
        if (!images || !images.length) return this.save(cb);

        var imager = new Imager(imagerConfig, 'Local');
        var self = this;

        this.validate(function (err) {
            if (err) return cb(err);
            imager.upload(images, function (err, cdnUri, files) {
                if (err) return cb(err);
                if (!cdnUri) cdnUri = '/tmp'+config.uploadImagesDirectory;
                if (files.length) {
                    self.image = { cdnUri : cdnUri, files : files };
                }
                self.save(cb);
            }, 'nodo');
        })
    },

    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @param {Function} cb
     * @api private
     */

    addComment: function (user, comment, cb) {
        //var notify = require('../mailer');

        this.comments.push({
            body: comment.body,
            user: user._id
        });

//        if (!this.user.email) this.user.email = 'email@product.com'
//        notify.comment({
//            nodo: this,
//            currentUser: user,
//            comment: comment.body
//        });

        this.save(cb);
    },

    /**
     * Remove comment
     *
     * @param {commentId} String
     * @param {Function} cb
     * @api private
     */

    removeComment: function (commentId, cb) {
        var index = utils.indexof(this.comments, { id: commentId });
        if (~index) this.comments.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    },


    /**
     * Add Video
     *
     * @param {Object} quiz
     * @param {Function} cb
     * @api private
     */
    addVideo: function(videos,cb){

        var self = this;
        var video_orig = self.videos;

        //@TODO upate video array.
//        self.videos = _.extend(video_orig,videos);

            for(var i=0; i< videos.length;i++){
                (function(){
                   // @TODO
                   var index = utils.indexof(self.videos, { link: videos[i].link });
                   if (~index) {
                       // exist  update.
                       self.videos[index].title = videos[i].title;
                       self.videos[index].link = videos[i].link;
                   }else{
                       self.videos.push({
                           title: videos[i].title,
                           link: videos[i].link
                       });
                   }

                })();

            }

        this.save(cb);



    },
//    @TODO no remove , update whole videos.
    removeVideo: function(videoId,cb){
        var index = utils.indexof(this.videos, { id: videoId });
        if (~index) this.videos.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    },
    /**
     * Add Quiz Answer
     *
     * @param {Object} quiz
     * @param {Function} cb
     * @api private
     */

    addQuiz: function (questions, cb) {
        var that = this;
        //console.log(questions.length);
        var tempQuiz = {};
        tempQuiz.questions =[];


        var step3 = function(){


            if(!that.quizzes.length){
                var quiz = new Quiz(tempQuiz);
                quiz.save(function(err){
                    if (err) console.log(err);
                    Quiz.findOne(quiz)

                        .exec( function(err, resultQuiz){
                            if(err) return console.log(err);
                            //console.log('reslutQuiz',resultQuiz);

                            that.quizzes.push({quiz:resultQuiz});

                            //console.log("before save",that.quizzes);


                            that.save(cb);
                        })
                })


            }else{
                //console.log(that.quizzes[0]);
                Quiz.findOne({ _id:that.quizzes[0].quiz._id })
                    .exec(function(err, resultQuiz){
                        //console.log("resultQuiz",resultQuiz);
                        if(!resultQuiz)return cb('error');

                        var quiz = resultQuiz;

                        tempQuiz = extend(quiz,tempQuiz);
                        //console.log(tempQuiz);
                        tempQuiz.save(function(err){
                            //console.log(err);
//                            Quiz.findOne(tempQuiz)
//
//                                .exec( function(err, resultQuiz){
//                                    if(err) return console.log(err);
//
//                                    that.quizzes = {quiz:resultQuiz};
                                   // console.log(that.quizzes);
                                    that.save(cb);
//                                })
                        })

                    });

            }


        }

        /// @TODO handle req data format by front end.
        var finishPushAnswers = function(answers,timer){
            var quiz = {};
            quiz.question =  questions[i].question;
            quiz.answers = answers;
            quiz.correct = questions[i].correct;
            quiz.incorrect = questions[i].incorrect;

            tempQuiz.questions.push(quiz);

            if(timer == questions.length-1){
                step3();
            }

        };



        for(var i=0; i< questions.length;i++){
            (function(done){
                //console.dir(questions[i].answers);
                var answers =[];
                for(var j=0; j< questions[i].answers.length;j++){
                    (function(){
                        if (questions[i].answers[j].correct == 'on') {
                            questions[i].answers[j].correct = true;
                        }else{
                            questions[i].answers[j].correct = false;
                        }
                        answers.push({
                            option : questions[i].answers[j].option,
                            correct :questions[i].answers[j].correct
                        });
                       // console.log(answers[j]);
                    })();

                }

                done(answers,i);



            })(finishPushAnswers)
        }

    },

    /**
     * update
     *
     * @param {Object} quiz
     * @param {Function} cb
     * @api private
     */
    updateQuiz: function (quiz, cb) {
        this.addQuiz(quiz,cb);
    },

    /**
     * Remove quiz
     *
     * @param {quizId} String
     * @param {Function} cb
     * @api private
     */

    removeQuiz: function (quizId, cb) {
        var index = utils.indexof(this.quizs, { id: quizId });
        if (~index) this.quizs.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    },

    /**
     * Remove answer
     *
     * @param {answerId} String
     * @param {Function} cb
     * @api private
     */

    removeAnswer: function (answerId, cb) {
        var index = utils.indexof(this.answers, { id: answerId });
        if (~index) this.answers.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    }

}

/**
 * Statics
 * */

NodoSchema.statics = {

    /**
     * Find nodo by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     * */

    load: function (id, cb){
        var criteria = mongoHelper.isObjectId(id) ? {_id:id}:{title:id};
        this.findOne(criteria)
            .populate('user', 'name email username')
            .populate('quizzes.quiz')
            .populate('comments.user')
            .populate('categories')
            .populate('scorm')
            .exec(cb);
    },

    list: function (options, cb){
        var criteria = options.criteria || {};
        this.find(criteria)
            .populate('user', 'name username')
            .populate('categories')
            .sort({'createdAt': -1})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);

    }

 }

module.exports = mongoose.model('Nodo', NodoSchema);

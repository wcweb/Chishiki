
var mongoose = require('mongoose');
var Imager = require('imager');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var imagerConfig = require(config.root + '/config/imager.js');
var Schema = mongoose.Schema;
var _= utils = require('../../lib/utils');

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
 * Article Schema
 */

var ArticleSchema = new Schema({
    title: {type : String, default : '', trim : true},
    body: {type : String, default : '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    videos:[{
        title:{ type : String, default :''},
        link: { type : String, default :''}
    }],
    quizzes:[{quiz:{type: Schema.ObjectId, ref : "Quiz"}}],
    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],
    tags: {type: [], get: getTags, set: setTags},
    image: {
        cdnUri: String,
        files: []
    },
    createdAt  : {type : Date, default : Date.now}
});


/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');


/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
    var imager = new Imager(imagerConfig, 'Local');
    var files = this.image.files;

    // if there are files associated with the item, remove from the cloud too
    imager.remove(files, function (err) {
        if (err) return next(err)
    }, 'article');

    // remove video quiz discuss

    next();
});


/**
 * Methods
 */

ArticleSchema.methods = {

    /**
     * Save article and upload image
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
                if (files.length) {
                    self.image = { cdnUri : cdnUri, files : files };
                }
                self.save(cb);
            }, 'article');
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
//            article: this,
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

    addQuiz: function (question, cb) {
        var self = this;
        console.log(question);
        this.quizzes.push({
            question: question.question,
            answers: question.answer,
            correct: question.correct,
            incorrect: question.incorrect
        });

        this.save(cb);
    },

    /**
     * Add Answer
     *
     * @param {Object} quiz
     * @param {Function} cb
     * @api private
     */

    addAnswer: function (quiz, answer, cb) {

        quiz.answers.push({
            option: answer.opiton,
            correct:answer.correct
        });

        this.save(cb);
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

ArticleSchema.statics = {

    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     * */

    load: function (id, cb){
        this.findOne({ _id : id })
            .populate('user', 'name email username')
            .populate('quizzes.quiz')
            .populate('comments.user')
            .exec(cb);
    },

    list: function (options, cb){
        var criteria = options.criteria || {};
        this.find(criteria)
            .populate('user', 'name username')
            .sort({'createdAt': -1})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);

    }

 }

mongoose.model('Article', ArticleSchema);
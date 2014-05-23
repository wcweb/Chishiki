var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var Schema = mongoose.Schema;
var Category = mongoose.model('Category');
require('./nodosDao');
var Nodo = mongoose.model('Nodo');
var mongoHelper = require('../../lib/helpers/mongo-helper');
var imagerConfig = require(config.root + '/config/imager.js');
var Imager = require('imager');
/**
 * course Schema
 */

var CourseSchema = new Schema({
  name: {type : String, default : '', trim : true, forms: {all:{}}},
  id: {type : Number, trim : true},
  nodos:[{type: Schema.Types.ObjectId, ref : "Nodo"}],
  description: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  participants:[{type: Schema.Types.ObjectId, ref : "User"}],
  image: {
      cdnUri: String,
      files: [{type : String, default : '', trim : true}]
  },
  createdAt  : {type : Date, default : Date.now},
  categories:[{type: Schema.Types.ObjectId, ref : "Category"}],
  scorm: {type: Schema.Types.ObjectId, ref : "Scorm"},
  quizzes:[{type: Schema.Types.ObjectId, ref : "Quiz"}],
  frontpage:{type:Boolean ,default: false}
});

/**
 * Validations
 */

CourseSchema.path('name').required(true, 'Course name cannot be blank');


/**
 * Pre-remove hook
 */

CourseSchema.pre('remove', function (next) {
    var imager = new Imager(imagerConfig, 'Local');
    var files = this.image.files;

    // if there are files associated with the item, remove from the cloud too
    imager.remove(files, function (err) {
        if (err) return next(err)
    }, 'course');

    // @TODO remove video quiz discuss

    next();
});


/**
 * Methods
 */

CourseSchema.methods = {


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
            }, 'course');
        })
    }
}



/**
 * Statics
 * */

CourseSchema.statics = {

    /**
     * Find nodo by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     * */

    load: function (id, cb){
        var criteria = mongoHelper.isObjectId(id) ? {_id:id}:{name:id};
        this.findOne(criteria)
            .populate('user', 'name email username')
            .populate('nodos')
            .populate('participants')
            .populate('categories')
            .populate('scorm')
            .exec(cb);
    },

    list: function (options, cb){
        var criteria = options.criteria || {};
        this.find(criteria)
            .populate('user', 'name username')
            .populate('nodos')
            .populate('categories')
            .sort({'createdAt': -1})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);

    }

 }

module.exports = mongoose.model('Course', CourseSchema);

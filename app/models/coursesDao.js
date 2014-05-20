var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var Schema = mongoose.Schema;
var Category = mongoose.model('Category');
require('./nodosDao');
var Nodo = mongoose.model('Nodo');
/**
 * course Schema
 */

var CourseSchema = new Schema({
  title: {type : String, default : '', trim : true, forms: {all:{}}},
  courseID: {type : Number, trim : true},
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

CourseSchema.path('title').required(true, 'Nodo title cannot be blank');


/**
 * Pre-remove hook
 */

CourseSchema.pre('remove', function (next) {
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
            }, 'nodo');
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
        this.findOne({ _id : id })
            .populate('user', 'name email username')
            .populate('nodos')
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

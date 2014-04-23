var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

/**
 * Category Schema
 */


var CategorySchema = new Schema({
    title: {type : String, default : '', trim : true},
    body: {type : String, default : '', trim : true},
    index: { type : Number, min:-1, default: -1 },
    children:[
      { type: Schema.Types.ObjectId, ref : 'Category'}
    ],
    parent: { type: Schema.Types.ObjectId, ref : 'Category' }
});


/**
 * Pre-remove hook
 **/

CategorySchema.pre('remove', function(next){

  next();
});


/**
 * Methods
 * */

CategorySchema.methods = {

  /**
   * Add children
   *
   * @param {Object} child
   * @param {Function} cb
   *
   */

  addChild:function (child, cb){
    var childCat = new Category(child);
    var that = this;
    childCat.parent = that;
    childCat.save(function(err){
      // @TODO index increaseing
      that.children.push(childCat);
      that.save(cb);
    });
  },


  /**
   * remove children
   *
   * @param {Object} child
   * @param {Function} cb
   *
   */

  removeChild:function (child, cb){
    var self = this;
    _.extend(child,{parent:self.id});
    console.log(child);
    Category.findOne(child, function(err, cat){
      console.log(err);
      if(err) throw err;
      console.dir(cat);
      if(cat) cat.remove(cb);
    });
  }
}

/**
 * Statics
 * /
 * */

CategorySchema.statics = {
    /**
     * Find children by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     * */

    getChildren: function(id, cb){
        this.find({ _id : id})
            .populate('children')
            .exec(cb);
    },
    getParents: function(id,cb){
        this.find({ _id : id })
            .populate('parent')
            .exec(cb);
    }
}
module.exports = mongoose.model('Category', CategorySchema);
var Category = mongoose.model('Category')

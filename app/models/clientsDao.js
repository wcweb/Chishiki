var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ClientsSchema = new Schema({
  name: {type : String, default : '', trim : true},
  clientId: {type : String, default : '', trim : true},
  clientSecret: {type : String, default : '', trim : true},
  trusted: { type: Boolean, default: false }
});


/**
 * Methods
 */

ClientsSchema.methods = {
    
}

/**
 * Statics
 * */

ClientsSchema.statics = {
  
  /**
   * Find client by id or clientId
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api statics
   * */

  load: function (id, cb){
      var criteria = mongoHelper.isObjectId(id) ? {_id:id}:{clientId:id};
      this.findOne(criteria)
          .exec(cb);
  },

  list: function (options, cb){
      var criteria = options.criteria || {};
      this.find(criteria)
          .sort({'createdAt': -1})
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb);

  }
}


module.exports = mongoose.model('Client', ClientsSchema);
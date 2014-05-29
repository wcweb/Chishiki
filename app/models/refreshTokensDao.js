var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RefreshTokensSchema = new Schema({

    refreshToken:{type : String, default : '', trim : true},
    userID: {type : Schema.ObjectId, ref : 'User'},
    clientID: {type : Schema.ObjectId, ref : 'Client'},
    scope:{type : String, default : '', trim : true}

  
  

});

/**
 * Path hook
 **/


/**
 * Methods
 */

RefreshTokensSchema.methods = {
  
}

/**
 * Statics
 * */

RefreshTokensSchema.statics = {
  
}
module.exports = mongoose.model('RefreshToken', RefreshTokensSchema);
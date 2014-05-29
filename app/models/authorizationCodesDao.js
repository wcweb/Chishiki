var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AuthorizationCodesSchema = new Schema({
  tokens: [{
    code: {type: String, default: '', trim: true},
    userID: {type : Schema.ObjectId, ref : 'User'},
    redirectURI: {type: String, default: '', trim: true},
    clientID: {type : Schema.ObjectId, ref : 'Client'},
    scope:{type : String, default : '', trim : true}
  }]
  
  

});



/**
 * Methods
 */

AuthorizationCodesSchema.methods = {
  
}

/**
 * Statics
 * */

AuthorizationCodesSchema.statics = {
  
}
module.exports = mongoose.model('AuthorizationCode', AuthorizationCodesSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AccessTokenSchema = new Schema({

    token:{type : String, default : '', trim : true},
    userID: {type : Schema.ObjectId, ref : 'User'},
    clientID: {type : Schema.ObjectId, ref : 'Client'},
    scope:{type : String, default : '', trim : true},
    expiresIn: { type: Number, default: 3600},
    expirationDate: { type: Date, expires:'1s'}

  
  

});


// AccessTokenSchema
//     .path('expirationDate')
//     .set(function(now){
//        this.expirationDate = new Date(now.getTime() + (this.expiresIn * 1000));
//     }).expires(function(){return this.expiresIn * 1000 });
//     



/**
 * Path hook
 **/

//@TODO expires day or time should be customed.
//AccessTokenSchema.path('expirationDate').expires('7d');


/**
 * Methods
 */

AccessTokenSchema.methods = {
  
}

/**
 * Statics
 * */

AccessTokenSchema.statics = {
  
}
module.exports = mongoose.model('AccessToken', AccessTokenSchema);
var builder = require('../../lib/helpers/scorm-builder');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ScormSchema = new Schema(
    {

        article :{type: Schema.Types.ObjectId, ref : "Article"},
        existence: { type: Boolean, default : true },
        fileUrl: { type: String, default : '', trim : true }
    }
);
/**
 * Methods
 */

ScormSchema.methods = {
    build: function (article, cb) {
        var that = this;

        builder.buildScorm(this,article, function(err,file){
            if(err) return console.log(err);
            this.fileUrl = file.fileUrl;
            that.save(cb)
        });
//        this.existence = true;

    }
}
module.exports = mongoose.model('Scorm', ScormSchema);

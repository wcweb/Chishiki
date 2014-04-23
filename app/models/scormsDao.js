var builder = require('../../lib/helpers/scorm-builder');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ScormSchema = new Schema(
    {

        article :{type: Schema.Types.ObjectId, ref : "Article"},
        existence: { type: Boolean, default : true },
        fileUrl: { type: String, default : '', trim : true },
        zipFile: { type: String, default : '', trim : true }
    }
);
/**
 * Methods
 */

ScormSchema.methods = {
    build: function (article, cb) {
        var that = this;

        builder.buildScorm(that,article, function(err,file){
            if(err) throw err;
            that.fileUrl = file.fileUrl;
            that.save(function(err){
                article.scorm = that;
                article.save(cb);
            })
        });
//        this.existence = true;

    },
    exportSCORM: function(article, cb){
        var url ='',err={};
        var that = this;
        builder.zipScorm(that,article, function(err,zipFile){

            if(err) throw err;
            that.zipFile = zipFile;
            that.save(cb);

        })

    }
}

module.exports = mongoose.model('Scorm', ScormSchema);

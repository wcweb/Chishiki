var builder = require('xmlbuilder');
var fs = require('fs');
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var ZIP = require('node-zip');

var fsHelper = require('./fs-helper')
, async = require('async')

exports.buildScorm = function(scorm,article,done){
    var err = {}, file= '', folder ='';
    var xml = builder.create('root')
        .ele('article');

    var art = article;
    for(var key in article.schema.paths){
        if(!art.hasOwnProperty(key)){
            xml.ele(key, {'type':''},art[key]);
        }
    }



    var xmlString = xml.end({ pretty: true, indent: '  ', newline: '\n' });

    folder = config.SCORM_Directory+'/'+article.id;


    async.auto({
        setup1:function(callback){
            fs.exists(folder, function(err){
                if( err) throw err;
                if(!err){
                    fsHelper.mkdirRecursively(folder,'777');
                    callback(null);
                }else{
                    callback(null);
                }
            })

        },
        setup2: ['setup1', function(callback,file){
            fs.writeFile(folder+'/scorm.xml', xmlString, function (err) {
                if (err) throw err;
                file = folder+'/scorm.xml';
                callback(null,file);
            });
        }]

    },function(err,result){
        if(err) throw err;
        done(err,result);
    });


}





exports.zipScorm = function(scorm,article,done){
    var err = {}, file={};
    var folder = config.SCORM_Directory+'/'+article.id;
    var zip = new ZIP();
    var zipFolder = config.SCORM_Directory+'/zip';

    async.waterfall([
        function(cb){
            zip.file('test.txt', 'hello there');

            if(fs.existsSync(folder)) {
                fsHelper.addFile(folder, zip);
                cb(null,"success");
            } else {
                // try build a SCORM again.
                exports.buildScorm(scorm, article, function(err,file){
                    fsHelper.addFile(folder, zip.folder, zip.file);
                    cb(null,"success");
                })

            }
        },
        function(success,cb){
            var data = zip.generate({base64:false,compression:'DEFLATE'});
            if(fs.existsSync(zipFolder)){
                fs.writeFile(zipFolder+'/'+article.id+'.zip', data, 'binary',function(err){
                    if (err) throw err;
                    cb(err,data);
                });
            }else{
                fs.mkdir(zipFolder, function(err){
                    if(!err){
                        fs.writeFile(zipFolder+'/'+article.id+'.zip', data, 'binary',function(err){
                            if (err) throw err;
                            cb(err,zip);
                        });

                    }
                });
            }

        }

    ], function(err,result){
        if(err) throw err;
        done(err, zipFolder+'/'+article.id+'.zip');
    });

}

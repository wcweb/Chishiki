var builder = require('xmlbuilder');
var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

exports.buildScorm = function(scorm,article,done){
    var err = {}, file= {};
    var xml = builder.create('root')
        .ele('article');
    console.log(scorm);
    var art = article;
    for(var key in article.schema.paths){
        if(!art.hasOwnProperty(key)){
            xml.ele(key, {'type':''},art[key]);
        }
    }



    var xmlString = xml.end({ pretty: true, indent: '  ', newline: '\n' });
    console.log(xmlString);
    fs.writeFile(config.tempDirectory+'/scorm.xml', xmlString, function (err) {
        if (err) done(err) ;
        console.log('It\'s saved!');
        done(err,file);
    });

}
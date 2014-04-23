var fs = require('fs');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var addFile = function(filePath, zip){

    if(fs.lstatSync(filePath).isDirectory()){
        var relatived_filePath = path.relative(
              path.dirname(config.tempDirectory),filePath);
        zip.folder(relatived_filePath);
        // @TODO fix dir constructor.
        console.log('relatived_filePath :',relatived_filePath);
        var directory = fs.readdirSync(filePath);
        directory.forEach(function(subDirectory){
            addFile(path.join(filePath, subDirectory), zip);
        });

    }else{
        if( path.basename(filePath).indexOf('.') == 0) return ;
        var relatived_filePath = path.relative(
            path.dirname(config.tempDirectory),filePath);
        zip.file(relatived_filePath,  fs.readFileSync(filePath, 'binary'));
    }
};
exports.addFile = addFile;
var mkdirRecursively = function(folderPath, mode){
    console.log('which folder: ', folderPath);
    try{
        fs.mkdirSync(folderPath,mode);
        return true;
    }catch(e){
        console.log('make recusively ');
        console.log(e);
        if(e.errno == 34 ){
          console.log('handle errno 34');
            mkdirRecursively(path.dirname(folderPath), mode);
            mkdirRecursively(folderPath,mode);
        }else if (e.errno == 47) {
          console.log(' will it be end?');

            return true;
        }else{
            throw e;
        }
    }
}
exports.mkdirRecursively = mkdirRecursively;

exports.emptyFolder = function(folderPath,cb){
    console.log('emptyFolder');
    var exec = require('child_process').exec,child;
    child = exec('rm -rf '+config.SCORM_Directory,function(err,out) {
        console.log(out); err && console.log(err);
        cb();
    });
}

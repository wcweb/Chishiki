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
    try{
        fs.mkdirSync(folderPath,mode);
        return true;
    }catch(e){
        if(e.errno == 34 ){
            mkdirRecursively(path.dirname(folderPath), mode);
            mkdirRecursively(folderPath,mode);
        }else if (e.errno == 47) {
            return true;
        }else{
            throw e;
        }
    }
}
exports.mkdirRecursively = mkdirRecursively;

exports.emptyFolder = function(folderPath,cb){
    var exec = require('child_process').exec,child;
    child = exec('rm -rf '+config.SCORM_Directory,function(err,out) {
        console.log(out); err && console.log(err);
        cb();
    });
}

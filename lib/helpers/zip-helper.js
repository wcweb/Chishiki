var fs = require('fs');
var path = require('path');
var ZIP = require('node-zip');


var zipWrapper = function(){
    var zip = new ZIP();

    this.addFile = function(filePath){
        if(fs.lstatSync(filePath).isDirectory()){
            zip.folder(filePath);
            var directory = fs.readdirSync(filePath);
            directory.forEach(function(subDirectory){
                addFile(path.join(filePath, subDirectory));
            });

        }else{
            zip.file(filePath,  fs.readFileSync(filepath, 'binary'));
        }
    };

    this.mkdirRecursively = function(folderPath, mode){
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
}

exports.addFile =

exports.builderZip = function(filePath){
    zipWrapper(filePath);
}

var gulp = require('gulp');

var libsPath=[
{
    "name": "jquery.dataTables",
    "styles":  "./bower_components/datatables/media/css/jquery.dataTables.css",
    "scripts": "./bower_components/datatables/media/js/jquery.dataTables.js"
},

{
    "name": "datatables-bootstrap3",
    "base": "./bower_components/datatables-bootstrap3/BS3/assets/",
    "styles":  "./bower_components/datatables-bootstrap3/BS3/assets/css/dataTables.css",
    "scripts": "./bower_components/datatables-bootstrap3/BS3/assets/js/dataTables.js",
    "images": "./bower_components/datatables-bootstrap3/BS3/assets/images/*"
},

{
    "name": "tinymce",
    "base": "./bower_components/tinymce/",
    "styles": "./bower_components/tinymce/js/tinymce/**/*.css",
    "images": "./bower_components/tinymce/js/tinymce/**/*{.ttf|.woff|.svg}",
    "scripts": "./bower_components/tinymce/js/tinymce/**/*.js"
}

];

gulp.task('bowerfiles:copy', function(){
  libsPath.forEach(function(lib){
    if(lib.styles){
      gulp.src(lib.styles,{base: lib.base})
      .pipe(gulp.dest('./public/bowers/'+lib.name+"/"));
    }
    if(lib.scripts){
      gulp.src(lib.scripts,{base: lib.base})
      .pipe(gulp.dest('./public/bowers/'+lib.name+"/"));
    }
    if(lib.images){
      gulp.src(lib.images,{base: lib.base})
      .pipe(gulp.dest('./public/bowers/'+lib.name+"/"));
    }
  })

});
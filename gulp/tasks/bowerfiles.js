var gulp = require('gulp');

var libsPath=[
{
   "name": "jquery",
   "scripts": "./bower_components/jquery/jquery.js"
},
{
   "name": "bootstrap",
   "styles":  "./bower_components/bootstrap/dist/bootstrap.css",
   "scripts": "./bower_components/bootstrap/dist/bootstrap.js",
   "images": "./bower_components/tinymce/js/tinymce/**/*{.ttf|.woff|.svg}",
},
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
},
{
   "name": "unslider",
   "base": "./bower_components/unslider/",
   "scripts": "./bower_components/unslider/src/unslider.js"
},
{
   "name": "chosen",
   "images":"./bower_components/chosen/public/*.png",
   "styles":  "./bower_components/chosen/public/chosen.css",
   "scripts": "./bower_components/chosen/public/chosen.jquery.js"
},
{
   "name": "jqtree",
   "styles":  "./bower_components/jqtree/jqtree.css",
   "scripts": "./bower_components/jqtree/tree.jquery.js"
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

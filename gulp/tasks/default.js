var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var grep = require('gulp-grep-stream');
var Combine = require('stream-combiner');
var paths = require('../config').paths;
var minifyCSS = require('gulp-minify-css');

var gulpFilter = require('gulp-filter');

var notApplication = gulpFilter('!application');



gulp.task('less',function(){
  gulp.src(paths.client+'/stylesheets/app.less')
      .pipe(less().on('error', console.log))
      .pipe(gulp.dest('./public/stylesheets'))
});

gulp.task('watch-less', ['less'],function() {
    gulp.watch([paths.client+'/stylesheets/**/*.less'], ['less']);
});



gulp.task('minify', function(){
  gulp.src('./public/javascripts/*.js')
    .pipe(notApplication)
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(rename('application.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('minify:css',['less'], function(){
  // gulp.src('./public/stylesheets/app.css')
  //     .pipe(gulp.dest('./public/stylesheets/'))
  //     .pipe(rename('application.css'))
  //     .pipe(gulp.dest('./public/stylesheets/'))
  //     .pipe(rename('application.min.css'))
  //     .pipe(minifyCSS({keepBreaks:true}))
  //     .pipe(gulp.dest('./public/stylesheets/'));
})

gulp.task('default', ['bowerfiles:copy','nodemon', 'watch-hbs','watch-less']);


gulp.task('production', ['bowerfiles:copy','hbs','less','minify']);
gulp.task('production:server', ['bowerfiles:copy','watch-hbs','watch-less','minify','minify:css','production:nodemon']);


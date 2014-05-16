var browserify = require('gulp-browserify');
var gulp = require('gulp');
var hbsfy = require('hbsfy').configure({
  extensions: ["handlebars"]
});;

var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var paths = require('../config').paths;



gulp.task('hbs',['lint'], function(){
    return gulp.src(paths.client+'/app.js',{ read: false })
        .pipe(plumber())
        .pipe(jshint())
        .pipe(browserify({
              basedir: './public/',
              transform: [hbsfy],
              ignore: ['./node_modules/**', './lib/**'],
              debug:true
            }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./public/javascripts'))
        .on('error', gutil.log);
});

gulp.task('watch-hbs', ['hbs'],function() {
    gulp.watch([paths.client+'/**'], ['hbs']);
});

gulp.task('lint', function() {
  return gulp.src(paths.client+'/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

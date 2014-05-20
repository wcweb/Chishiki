var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var mocha = require('gulp-mocha');
var paths = require('../config').paths;
var plumber = require('gulp-plumber');
var grep = require('gulp-grep-stream');


var args = require('yargs')
  .options('f', {
    alias: 'flag',
    default: ''
  })
  .usage('Usage: $0 -f/flag [^@string] ')
  .argv;

var flag = args.f;

gulp.task('test', function() {

  return gulp
    .src(paths.test, {
      read: false
    })
    .pipe(
      watch({
        emit: 'all'
      }, function(files) {
        files
        // .pipe(plumber())
        .pipe(grep('/**/*-test.js'))
        .pipe(
          mocha({
            ui: 'bdd',
            reporter: 'list',
            grep: flag,
            timeout: 10000,
            globals: {
              should: require('should')
            }
          })
          .on('error', onError)
        )
      }))
    .on('error', onError);
});

gulp.task("watch",  function () {
  watching = true;
  gulp.watch([paths.test], ["test2"]);
});
gulp.task("test2", function() {
  return gulp.src(paths.test)
    .pipe(mocha({ reporter: "list" }).on("error", onError));
});
var watching = true;
function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    // if you want to be really specific
    process.exit(1);
  }
}
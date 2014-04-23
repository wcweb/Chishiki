var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var grep = require('gulp-grep-stream');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var browserifyHandlebars = require('browserify-handlebars');
var hbsfy = require('hbsfy');
var hbsHelpers = require('./lib/helpers/handlebars-helpers');

var paths ={
    app:['app/**','app'],
    test:'test/**/*-test.js'
}

gulp.task('watch:test', function() {

    gulp.src(['test/*.js'],{read:false})
        .pipe(
        watch({
            glob: 'test',
            emit: 'all' }, function(files) {
            files
                .pipe(plumber())
                .pipe(mocha())
                .on('error', function(err) {

                    if (!/tests? failed/.test(err.stack)) {
                        console.log(err.stack);
                    }
                    this.emit('end');
                })
        }));
});

gulp.task('mocha',function(){

    gulp.src(paths.test)
        .pipe(mocha(
            {
                ui:'bdd',
                reporter: 'list',
                //grep: '@fast',
                timeout: 10000,
                globals: {
                    should: require('should')
                }
            }
        ))
        .on('error',gutil.log);
});

gulp.task('mocha:fast',function(){

    gulp.src(paths.test)
        .pipe(mocha(
            {
                ui:'bdd',
                reporter: 'list',
                grep: '@fast',
                timeout: 10000,
                globals: {
                    should: require('should')
                }
            }
        ))
        .on('error',gutil.log);
});



gulp.task('server:test', function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['ignored.js']
        ,env:{ 'NODE_ENV' : 'test'}
        //,nodeArgs: ['--debug']
    }).on('restart', ['mocha']).on('error',function(err){
            console.dir(err);
        });

});
gulp.task('fast:test', function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['ignored.js']
        ,env:{ 'NODE_ENV' : 'test'}
        //,nodeArgs: ['--debug']
    }).on('restart', ['mocha:fast']).on('error',function(err){
            console.dir(err);
        });

});


gulp.task('server',function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['test/*','templates/*','public/*','client/**']
        ,env:{ 'NODE_ENV' : 'development'}
    }).on('restart');

})




gulp.task('hbs', function(){
    gulp.src('./client/app.js')
        .pipe(browserify({
            basedir: './client/',
            insertGlobals: true,
            transform: [hbsfy]
        })).on('error',function(err){

                    console.dir(err);

            })
        .pipe(gulp.dest('./public/javascripts/'))


});

gulp.task('watchhbs',['hbs'],function(){
    gulp.watch(['client/**/*','public/javascripts/**/*.js'],['hbs'])
        .on('change', function(event){
            console.log('File ' + event.path + ' was ' + event.type + ', building scripts...');
        })
});


gulp.task('default',function(){
    gulp.run('server','watchhbs');
});

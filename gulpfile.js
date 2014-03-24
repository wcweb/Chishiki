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


var paths ={
    app:['app/**','app'],
    test:'test/*-test.js'
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
                timeout: 10000,
                globals: {
                    should: require('should')
                }
            }
        ))
        .on('error',gutil.log);
});


gulp.task('templates',function(){
    gulp.src(['templates/*.handlebars'],{read:false})
        .pipe(
            watch({
                emit: 'all' }, function(files) {
                files
                    .pipe(plumber())
//                    .pipe(grep('templates/*.handlebars'))
                    .pipe(handlebars())
                    .pipe(defineModule('plain',{
                        //wrapper:"define('<%= name %>', ['exports'], function(__exports__){ __exports__['default'] = <%= handlebars %>; });"
                        wrapper: 'MyApp.templates["<%= name %>"] = <%= handlebars %>'
                    }))
                    .pipe(concat('templates.js'))
                    .pipe(gulp.dest('public/javascripts/'))

                    .on('error', function(err) {

                        if (!/tests? failed/.test(err.stack)) {
                            console.log(err.stack);
                        }
                        this.emit('end');
                    })
            }));
});


gulp.task('server:test', function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['ignored.js']
        ,env:{ 'NODE_ENV' : 'test'}
    }).on('restart', ['mocha']);

});



gulp.task('server',function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['test/*','templates/*','public/*']
        //,env:{ 'NODE_ENV' : 'test'}
    }).on('restart');

})




gulp.task('hbs', function(){
    gulp.src('./client/app.js')
        .pipe(browserify({
            basedir: './client/',
            transform: [browserifyHandlebars]
        }))
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

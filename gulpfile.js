var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

var paths ={
    app:['app/**','app'],
    test:'test/*-test.js'
}
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

gulp.task('nodemon', function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['ignored.js']
        //,env:{ 'NODE_ENV' : 'test'}
    }).on('restart', ['mocha']);

})

//gulp.task('watch',function(){
    //gulp.watch(['app/**','test/**','app'],['mocha']);
//});

gulp.task('default',['nodemon']);

var gulp = require('gulp');

var nodemon = require('gulp-nodemon');




gulp.task('nodemon',function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['test/*','templates/*','public/*','client/**']
        ,env:{ 'NODE_ENV' : 'development'}
    }).on('restart');

})


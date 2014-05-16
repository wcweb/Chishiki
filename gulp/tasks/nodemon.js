var gulp = require('gulp');

var nodemon = require('gulp-nodemon');




gulp.task('nodemon',function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['test/**','templates/**','public/**','node_modules/**']
        ,env:{ 'NODE_ENV' : 'development'}
    }).on('restart');

})

gulp.task('production:nodemon',function(){

    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore:['test/**','templates/**','public/**','node_modules/**']
        ,env:{ 'NODE_ENV' : 'production'}
    }).on('restart');

})
var courses = require('../controllers/courses');
var authRule = require('../../config/auth-rules');
var courseAuth = authRule.course;
var auth = authRule.auth;
var components = require('../../config/middlewares/components');

var middleware = [components.categories.list];

module.exports = function( app ){
    // nodo routes
    app.param('crid', courses.load);

    // @TODO env role test.
    app.get('/courses', courses.index);
     if( process.env.NODE_ENV !== 'test'){
         app.get('/courses/new',middleware, courses.new);
         app.post('/courses', courses.create);
     }else{
         app.get('/courses/new', auth.requiresLogin, middleware,courses.new);
         app.post('/courses', auth.requiresLogin,middleware, courses.create);
     }
    app.get('/courses/:crid',  courses.show);
     //app.get('/courses/:crid/edit', courseAuth,middleware, courses.edit);
     //app.put('/courses/:crid', courseAuth, middleware, courses.update);
     //app.del('/courses/:crid', courseAuth, courses.destroy);
}

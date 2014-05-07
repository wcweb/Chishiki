var nodos = require('../controllers/nodos');
var authRule = require('../../config/auth-rules');
var nodoAuth = authRule.nodo;
var auth = authRule.auth;
var components = require('../../config/middlewares/components');

var middleware = [components.categories.list];

module.exports = function( app ){
    // nodo routes
    app.param('artid', nodos.load);

    // @TODO env role test.
    app.get('/nodos', nodos.index);
    if( process.env.NODE_ENV !== 'test'){
        app.get('/nodos/new',middleware, nodos.new);
        app.post('/nodos', nodos.create);

    }else{
        app.get('/nodos/new', auth.requiresLogin, middleware,nodos.new);
        app.post('/nodos', auth.requiresLogin,middleware, nodos.create);

    }

    app.get('/nodos/:artid',  nodos.show);
    app.get('/nodos/:artid/edit', nodoAuth,middleware, nodos.edit);
    app.put('/nodos/:artid', nodoAuth, middleware, nodos.update);
    app.del('/nodos/:artid', nodoAuth, nodos.destroy);
}

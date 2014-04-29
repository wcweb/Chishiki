var auth = require('../../config/auth-rules');
var comments = require('../controllers/comments');

module.exports = function( app ){
    app.param('commentId', comments.load);
    app.post('/nodos/:artid/comments', auth.requiresLogin, comments.create);
    app.get('/nodos/:artid/comments', auth.requiresLogin, comments.create);
    app.del('/nodos/:artid/comments/:commentId', auth.requiresLogin, comments.destroy);
}


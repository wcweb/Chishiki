var quizzes = require('../controllers/quizzes');
var nodoAuth = require('../../config/auth-rules').nodo;
module.exports = function( app ){
    app.param('quizId', quizzes.load);
    app.post('/nodos/:artid/quizzes',nodoAuth, quizzes.create);
    app.get('/nodos/:artid/quizzes', nodoAuth, quizzes.create);
    app.put('/nodos/:artid/quizzes/:quizId', quizzes.update);
    app.del('/nodos/:artid/quizzes/:quizId', quizzes.destroy);
}

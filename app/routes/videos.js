var videos = require('../controllers/videos');
var authRules = require('../../config/auth-rules');
var nodoAuth = authRules.nodo;
module.exports = function( app ){
    app.param('videoId', videos.load);
    app.post('/nodos/:artid/videos',nodoAuth, videos.create);
    app.get('/nodos/:artid/videos', nodoAuth, videos.create);
    app.del('/nodos/:artid/videos/:videoId', videos.destroy);

}

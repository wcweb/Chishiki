module.exports = function( app ){
  var tags = require('../controllers/tags');
  app.get('/tags/:tag', tags.index);
}

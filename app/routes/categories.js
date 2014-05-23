
var categories = require('../controllers/categories');
module.exports = function( app ){
  app.get('/categories/:category', categories.show);
  app.get('/categories',categories.all);
}

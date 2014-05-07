
var categories = require('../controllers/categories');
module.exports = function( app ){
  app.get('/categories/:category', categories.index);
  app.get('/categories',categories.all);
}

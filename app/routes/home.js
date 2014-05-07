var home = require('../controllers/home');
var categories= require('../controllers/categories');
var courses= require('../controllers/courses');

var allList =[courses.list, categories.list];

module.exports = function( app ){
  app.get('/', allList,home.index);
}

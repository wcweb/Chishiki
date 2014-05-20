var role = require('../../config/connect-roles').roles;
var dashboard = require('../controllers/dashboards');
  // dashboard routes
module.exports = function( app ){
  app.get('/dashboard/index',role.can('access member page'), dashboard.index);
  app.get('/dashboard/admin',role.is('admin'), dashboard.admin);
  app.get('/dashboard/users/list', dashboard.listUser);
  //app.get('/dashboard/users/:userid/edit', role.is('admin'),dashboard.edituser);
  app.get('/dashboard/newNodo', dashboard.newNodo);
}

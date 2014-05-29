
var fs = require('fs');
var onlyScripts = require('../gulp/util/scriptFilter');
var routes = fs.readdirSync('./app/routes/').filter(onlyScripts);
var oauth2 = require('../app/controllers/oauth2');


var authRule = require('./auth-rules');
var auth = authRule.auth;


/**
 * Route middlewares
 * */

module.exports = function (app, passport){

    app.use(require('./connect-roles'));

    //require('../app/routes/home')(app);
    //require('../app/routes/users')(app,passport);
    //require('../app/routes/nodos')(app);
    //require('../app/routes/videos')(app);
    //require('../app/routes/quizzes')(app);
    //require('../app/routes/scorms')(app);
    //require('../app/routes/tags')(app);
    //require('../app/routes/dashboards')(app);

    
    routes.forEach(function(route){
      require('../app/routes/'+route)(app,passport);
    });
    
    
    app.get('/dialog/authorize', auth.requiresLogin, oauth2.authorization);
    app.post('/dialog/authorize/decision', oauth2.decision);
    app.post('/oauth/token', oauth2.token);
    
}

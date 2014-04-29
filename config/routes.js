var home = require('../app/routes/home');
/**
 * Route middlewares
 * */

module.exports = function (app, passport){

    app.use(require('./connect-roles'));

    require('../app/routes/home')(app);
    require('../app/routes/users')(app,passport);
    require('../app/routes/nodos')(app);
    require('../app/routes/videos')(app);
    require('../app/routes/quizzes')(app);
    require('../app/routes/scorms')(app);
    require('../app/routes/tags')(app);
    require('../app/routes/dashboards')(app);

}

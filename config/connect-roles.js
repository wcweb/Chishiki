var express = require('express');
var app = module.exports = express();
var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        //console.log(req.user);
        if (~accept.indexOf('html')) {
            res.render('access-denied', {action: action});
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

user.use(function(req, action){
    if(!req.isAuthenticated()) return action === 'access anonymous page';
})

user.use('access member page', function(req){
    if(req.user.role === 'member'){
        return true;
    }
})

user.use(function(req){
    if(req.user.role === 'admin'){
        return true;
    }
})

app.use(user.middleware());
module.exports.roles = user;

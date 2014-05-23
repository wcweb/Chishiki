
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) return next()
    if (req.method == 'GET') req.session.returnTo = req.originalUrl
    res.redirect('/login')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
    hasAuthorization: function (req, res, next) {
        if (req.profile.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/users/' + req.profile.id)
        }
        next()
    }
}

/*
 *  Nodo authorization routing middleware
 */

exports.nodo = {
    hasAuthorization: function (req, res, next) {
        if (req.nodo.user.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/nodos/' + req.nodo.id)
        }
        next()
    }
}

/*
 *  Course authorization routing middleware
 */

exports.course = {
    hasAuthorization: function (req, res, next) {
        if (req.course.user.id == req.user.id)  return next();
        var participantBool = false;
        if(req.course.participants.some(function(participant){
          return participant.id == req.user.id;
        })){
          next();
        }else{
          req.flash('info', 'You are not authorized')
          return res.redirect('/courses/' + req.course.name)
        }
    }
}

/**
 * Comment authorization routing middleware
 */

exports.comment = {
    hasAuthorization: function (req, res, next) {
        // if the current user is comment owner or nodo owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id || req.user.id === req.nodo.user.id) {
            next()
        } else {
            req.flash('info', 'You are not authorized')
            res.redirect('/nodos/' + req.nodo.id)
        }
    }
}

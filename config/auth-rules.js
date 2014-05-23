var auth = require('./middlewares/authorization');
if( process.env.NODE_ENV !== 'test'){
  var nodoAuth = [
      auth.requiresLogin,
      auth.nodo.hasAuthorization
  ];
}else{
  var nodoAuth = [
  ];
}

    var commentAuth = [
        auth.requiresLogin,
        auth.comment.hasAuthorization
    ];


    var courseAuth = [
      auth.requiresLogin,
      auth.course.hasAuthorization
    ];
exports.nodo = nodoAuth;
exports.comment = commentAuth;
exports.course = courseAuth;
exports.auth = auth;

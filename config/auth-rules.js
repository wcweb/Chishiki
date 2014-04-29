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
exports.nodo = nodoAuth;
exports.comment = commentAuth;
exports.auth = auth;

var auth = require('./middlewares/authorization');
// var oauth2 = require('./middlewares/oauth2');



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
    
    // var oauth = [
    // oauth2.au
    // ]
    
exports.nodo = nodoAuth;
exports.comment = commentAuth;
exports.course = courseAuth;
exports.auth = auth;

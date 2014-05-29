var oauth2orize = require('oauth2orize');
var passport = require('passport');
var utiles = require('../../lib/helpers/uid-helper');

var mongoose = require('mongoose');

var User = mongoose.model('User');

var AuthorizationCode = mongoose.model('AuthorizationCode');
var AccessToken = mongoose.model('AccessToken');
var RefreshToken = mongoose.model('RefreshToken');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

var server = oauth2orize.createServer();



server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done){
  var code = uidHelper.uid(config.token.authorizationCodeLength);
  //  @TODO ares,
  var authorizationCode = new AuthorizationCode({
    code:code,
    client: client.id,
    redirectURI: redirectURI, 
    userID: user.id, 
    scope: client.scope,
  })
  authorizationCode.save(function(err,code){
    if(err) return done(err);
    done(null, code);
  });
}));


server.grant(oauth2orize.grant.token(function(client, user, areas, done){
  var token = utiles.uid(config.token.authorizationCodeLength);
  var accessToken = new AccessToken({
    token:token,
    client: client.id,
    userID: user.id, 
    scope: client.scope
  })
  accessToken.save(function(err,token){
    if(err) return done(err);
    done(null, token);
  });
}));



// exchange token from code
server.exchange(oauth2orize.exchange.code(function( client, code, redirectURI, done){
  authorizationCode.findOne({code:code}, function(err, authCode){
    if(err) return done(err);
    if(!authCode) return done( null, false);
    if(client.id !== authCode.clientID) return done(null, false);
    if(redirectURI !== authCode.redirectURI) return done(null, false);
    authCode.remove(function(err, result){
      if(err) return done(err);
      var token = utiles.uid(config.token.authorizationCodeLength);
      
      var accessToken = new AccessToken({
        token:token,
        clientID: authCode.clientID,
        expirationDate:new Date(),
        expires_in: config.token.expiresIn,
        userID: authCode.userID, 
        scope: authCode.scope
      })
      accessToken.save(function(err, accessToken){
        if(err) return done(err);
        var refreshToken = null;
        //I mimic openid connect's offline scope to determine if we send
        //a refresh token or not
        
        if( authCode.scope && authCode.scope.indexOf("offline_access") === 0){
          refreshToken =  utiles.uid(config.token.authorizationCodeLength);
          var refreshToken = new RefreshToken({
            refreshToken : RefreshToken,
              userID: authCode.userID, 
              clientID: authCode.clientID,
              scope: authCode.scope
          });
          refreshToken.save(function(err, token){
            if(err) return done(err);
            return done(null, token, refreshToken, {expires_in: config.token.expiresIn });
          })
        } else {
          return done(null, token, refreshToken, {expires_in: config.token.expiresIn });
        }
        
      });
      
     
      
    });
  });
}));



server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done){
  
  // console.log('.exchange.password',client, username, password, scope);
  
  User.findOne({username: username}, function(err, user){
    if(err) return done(err);
    
    if(!user) return done(null, false);
    
    if(!user.authenticate(password)) return done(null, false);
    
    var token = utiles.uid(config.token.authorizationCodeLength);
    var accessToken = new AccessToken({
      token: token,
      expirationDate:new Date(),
      expires_in: config.token.expiresIn,
      userID: user.id,
      clientID: client.id,
      scope: scope
    });
    
    accessToken.save(function(err){
      if(err) return done(err);
     
      var refreshToken = null;
      if( scope && scope.indexOf("offline_access") === 0){
        refreshToken =  utiles.uid(config.token.authorizationCodeLength);
        var r = new RefreshToken({
          refreshToken : refreshToken,
            userID: user.id, 
            clientID: client.id,
            scope: scope
        });
        r.save(function(err){
          if(err) return done(err);
          
          return done(null, token, refreshToken, {expires_in: config.token.expiresIn });
        })
      } else {
        return done(null, token, refreshToken, {expires_in: config.token.expiresIn });
      }
    });
    
    
    
  });
  
}));



server.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done){
  var token = utils.uid(config.token.accessTokenLength);
  var accessToken = new AccessToken({
    token: token,
    expirationDate:new Date(),
    expires_in: config.token.expiresIn,
    clientID: client.id,
    scope: scope
  });
  
  accessToken.save(function(err){
    if(err) return done(err);
    return done(null, token, null, {expires_in: config.token.expiresIn });
  });
  
}));





server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done){
  RefreshToken.findOne({refreshToken: refreshToken }, function(err, result){
    if(err) return done(err);
    if(!authCode) return done(null, false);
    if(clinet.id !== authCode.clientID) return done(null, false);
    
    var token = utils.uid(config.token.accessTokenLength);
    
    var accessToken = new AccessToken({
      token: token,
      expirationDate:new Date(),
      expires_in: config.token.expiresIn,
      userID: result.userID,
      clientID: result.clientID,
      scope: result.scope
    });
    
    accessToken.save(function(err){
      if(err) return done(err);
      return done(null, token, null,  {expires_in: config.token.expiresIn });
    });
    
    
  });
}));



exports.authorization = [
    server.authorization(function(clientID, redirectURI, scope, done){
      Client.findOne({clientID:clientID}, function(err, client){
        if(err) return done(err);
        if(client) client.scope = scope;
        // WARNING: For security purposes, it is highly advisable to check that
        //          redirectURI provided by the client matches one registered with
        //          the server.  For simplicity, this example does not.  You have
        //          been warned.
        return done(null, client, redirectURI);
        
      })
    }),
    function (req, res, next){
      //Render the decision dialog if the client isn't a trusted client
      //TODO Make a mechanism so that if this isn't a trusted client, the user can recorded that they have consented
      //but also make a mechanism so that if the user revokes access to any of the clients then they will have to
      //re-consent.
      
      Client.find({ clientID: req.query.client_id }, function(err, client){
        if(err) return next(err);
        
        if(!err && client && client.trustedClient && client.trustedClient == true){
          server.decision({loadTransaction: false }, function(req, callback){
            callback(null, {allow: true});
          })(req, res, next);
        } else {
          res.render('/oauth/dialog', {
            transacionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client
          });
        }
        
      
      });
      
      
    }
];


exports.decision = [
  server.decision()
];


exports.token = [
  // function(req,res,next){console.log(req,res,next);},
  passport.authenticate(['basic', 'oauth2-client-password'], {session:false}),
  server.token(),
  server.errorHandler()
];


server.serializeClient(function(client, done){
  return done(null, client.id);
});

server.deserializeClient(function(id, done){
  Client.findOne({_id:id}, function(err, client){
    if(err) return done(err);
    return done(null, client);
  });
});


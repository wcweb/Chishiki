var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var Client = mongoose.model('Client');
var AccessToken = mongoose.model('AccessToken');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function (passport, conifg){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findOne({ _id: id }, function(err, user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField:  'email',
            passwordField:  'password'
        },
        function(email, password, done){
            User.findOne({ email: email}, function(err, user){
                if(err) { return done(err);}
                if(!user){
                    return done(null, false, {message: 'Unknow user'});
                }
                if(!user.authenticate(password)){
                    return done(null, false, { message: 'Invalid password'});
                }
                return done(null, user);
            });

        })
    );
    
    passport.use(new BearerStrategy(
      function(accessToken, done) {
        
        //  console.log('BearerStrategy, accessToken found nothing \n ',accessToken);
        AccessToken.findOne({ token: accessToken }, function (err, token) {
          if (err) { return done(err); }
          
          if (!token) { return done(null, false); }
          
          if(token.userID != null){
            User.findOne({_id:token.userID},function(err, user){
              if (err) { return done(err); }
              
              if (!user) { return done(null, false); }
              // to keep this example simple, restricted scopes are not implemented,
              // and this is just for illustrative purposes
              var info = { scope: '*'};
              return done(null, user, info);
            
            });
          }else{
            Client.findOne({_id:token.clientID},function(err, client){
              if (err) { return done(err); }
              if (!client) { return done(null, false); }
              // to keep this example simple, restricted scopes are not implemented,
              // and this is just for illustrative purposes
              var info = { scope: '*'};
              return done(null, client, info);
              
            });
          }
          
         // return done(null, token, { scope: 'all' });
        });
      }
    ));
    
    
    passport.use(new BasicStrategy(
      function(username, password, done) {
        //console.log('BasicStrategy, client found nothing \n ',username, password);

        Client.findOne({clientId:username}, function(err, client) {
          
          if (err) { return done(err); }
          if (!client) { return done(null, false); }
          
          if (client.clientSecret != password) { return done(null, false); }
          
        
          return done(null, client);
        });
      }
    ));

    passport.use(new ClientPasswordStrategy(
      
        function (clientId, clientSecret, done) {
          
          //console.log('ClientPasswordStrategy, client found nothing \n ',clientId, clientSecret);
          
            Client.findOne({_id:clientId}, function (err, client) {
                if (err) {
                    return done(err);
                }
                if (!client) {
                    return done(null, false);
                }
                console.log(client);
                if (client.clientSecret != clientSecret) {
                    return done(null, false);
                }
                return done(null, client);
            });
        }
    ));

//
//
//    // use twitter strategy
//    passport.use(new TwitterStrategy({
//            consumerKey: config.twitter.clientID,
//            consumerSecret: config.twitter.clientSecret,
//            callbackURL: config.twitter.callbackURL
//        },
//        function(token, tokenSecret, profile, done) {
//            User.findOne({ 'twitter.id_str': profile.id }, function (err, user) {
//                if (err) { return done(err) }
//                if (!user) {
//                    user = new User({
//                        name: profile.displayName,
//                        username: profile.username,
//                        provider: 'twitter',
//                        twitter: profile._json
//                    })
//                    user.save(function (err) {
//                        if (err) console.log(err)
//                        return done(err, user)
//                    })
//                }
//                else {
//                    return done(err, user)
//                }
//            })
//        }
//    ))
//
//    // use facebook strategy
//    passport.use(new FacebookStrategy({
//            clientID: config.facebook.clientID,
//            clientSecret: config.facebook.clientSecret,
//            callbackURL: config.facebook.callbackURL
//        },
//        function(accessToken, refreshToken, profile, done) {
//            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
//                if (err) { return done(err) }
//                if (!user) {
//                    user = new User({
//                        name: profile.displayName,
//                        email: profile.emails[0].value,
//                        username: profile.username,
//                        provider: 'facebook',
//                        facebook: profile._json
//                    })
//                    user.save(function (err) {
//                        if (err) console.log(err)
//                        return done(err, user)
//                    })
//                }
//                else {
//                    return done(err, user)
//                }
//            })
//        }
//    ))
//
//    // use github strategy
//    passport.use(new GitHubStrategy({
//            clientID: config.github.clientID,
//            clientSecret: config.github.clientSecret,
//            callbackURL: config.github.callbackURL
//        },
//        function(accessToken, refreshToken, profile, done) {
//            User.findOne({ 'github.id': profile.id }, function (err, user) {
//                if (!user) {
//                    user = new User({
//                        name: profile.displayName,
//                        email: profile.emails[0].value,
//                        username: profile.username,
//                        provider: 'github',
//                        github: profile._json
//                    })
//                    user.save(function (err) {
//                        if (err) console.log(err)
//                        return done(err, user)
//                    })
//                } else {
//                    return done(err, user)
//                }
//            })
//        }
//    ))
//
//    // use google strategy
//    passport.use(new GoogleStrategy({
//            clientID: config.google.clientID,
//            clientSecret: config.google.clientSecret,
//            callbackURL: config.google.callbackURL
//        },
//        function(accessToken, refreshToken, profile, done) {
//            User.findOne({ 'google.id': profile.id }, function (err, user) {
//                if (!user) {
//                    user = new User({
//                        name: profile.displayName,
//                        email: profile.emails[0].value,
//                        username: profile.username,
//                        provider: 'google',
//                        google: profile._json
//                    })
//                    user.save(function (err) {
//                        if (err) console.log(err)
//                        return done(err, user)
//                    })
//                } else {
//                    return done(err, user)
//                }
//            })
//        }
//    ));
//
//    // use linkedin strategy
//    passport.use(new LinkedinStrategy({
//            consumerKey: config.linkedin.clientID,
//            consumerSecret: config.linkedin.clientSecret,
//            callbackURL: config.linkedin.callbackURL,
//            profileFields: ['id', 'first-name', 'last-name', 'email-address']
//        },
//        function(accessToken, refreshToken, profile, done) {
//            User.findOne({ 'linkedin.id': profile.id }, function (err, user) {
//                if (!user) {
//                    user = new User({
//                        name: profile.displayName
//                        , email: profile.emails[0].value
//                        , username: profile.emails[0].value
//                        , provider: 'linkedin'
//                    })
//                    user.save(function (err) {
//                        if (err) console.log(err)
//                        return done(err, user)
//                    })
//                } else {
//                    return done(err, user)
//                }
//            })
//        }
//    ));



}
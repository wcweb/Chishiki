var RedisStore = require('socket.io/lib/stores/redis')
    , redis  = require('socket.io/node_modules/redis')
    , pub    = redis.createClient()
    , sub    = redis.createClient()
    , client = redis.createClient();



module.exports = function (io){
    io.set('store', new RedisStore({
        redisPub : pub
        , redisSub : sub
        , redisClient : client
    }));
    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);

        });

        socket.on('postTalk', function(data){

            socket.broadcast.emit('someOneTalk',{msg:data.msg});
        })

    });

    io.configure('production', function(){
        io.enable('browser client etag');
        io.set('log level', 1);

        io.set('transports', [
            'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
        ]);
    });
    io.configure('development', function(){
        io.set('transports', ['websocket']);
    });
}
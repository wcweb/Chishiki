
/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , async = require('async')
    , Nodo = mongoose.model('Nodo')
    , User = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
    async.parallel([
        function (cb) {
            User.collection.remove(cb);
        },
        function (cb) {
            Nodo.collection.remove(cb);
        }
    ], done);
}


exports.fakeDb = function(done) {
    var count= 4;
    async.whilst(
        function(){
            return count > 0;
        },
        function(done2){
            user = new User({
                email: 'foobarTest'+count+'@example.com',
                name: 'Foo'+count+' bar',
                username: 'foobar'+count+'Test',
                password: 'foobar'
            });
            user.save();

            nodo = new Nodo({
                title: 'foo'+count+' bar',
                body: 'this '+count+
                    'is body Cras sit amet nibh libero, ' +
                    'in gravida nulla. Nulla vel metus scelerisque' +
                    ' ante sollicitudin commodo. Cras purus odio,' +
                    ' vestibulum in vulputate at, tempus viverra' +
                    ' turpis. Fusce condimentum nunc ac nisi' +
                    ' vulputate fringilla. Donec lacinia' +
                    ' congue felis in faucibus.',
                user: user
            });
            nodo.save(function(err){

                if(err) return err;
                count--;
              done2();
            });
        },
        function(err){
            if(err)
                console.error(err.stack);
            done();
        }
    );


}


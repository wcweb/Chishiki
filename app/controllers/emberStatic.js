
/*
 * GET Ember.
 */

exports.index = function(req, res){
    res.sendfile("index.html", function(err){
        if(err){next(); return; }
    });
};


/*
 * GET Ember.
 */

exports.index = function(req, res){
    res.sendfile("./public/dist/demo.html", function(err){
        if(err){
            console.dir(err,'stack');
            return; }
    });
};

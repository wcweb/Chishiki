
/*
 * GET Ember.
 */

exports.index = function(req, res){
    res.render("emberFront.html", function(err){
        if(err){
            console.dir(err,'stack');
            return; }
    });
};

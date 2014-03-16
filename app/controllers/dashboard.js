exports.index = function (req, res){
    res.render('dashboard/index',{title:'Dashboard Index'});
}

exports.admin = function (req, res){
    res.render('dashboard/admin',{title:'Dashboard Admin'});
}
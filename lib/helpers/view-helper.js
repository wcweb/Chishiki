exports.createPagination = function (req){
  return function( pages, page, paramsname){
    var url = require('url')
      , qs = require('querystring')
      , params = qs.parse(url.parse(req.url).query)
      , str = '';

    params[paramsname] = 1;
    var clas = page == 1 ? "active" : "no";
    str += '<li class="'+ clas + '"><a href="?'+ qs.stringify(params) + '">First</a></li>';
    for( var p = 1; p<= pages; p++) {
      params[paramsname] = p;
      clas = page == p ? "active": "on";
      str += '<li class="'+ clas + '"><a href="?'+ qs.stringify(params)+'">' + p +'</a></li>';
    }
    params[paramsname] = --p;
    clas = page == params[paramsname] ? "active" : "on";
    str += '<li class="' + clas + '"><a href="?'+ qs.stringify(params) +' ">Last</a></li>';
    return str;
  }
}

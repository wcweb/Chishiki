//define('_forms/_videosForm', ['exports'], function(__exports___){
//   console.log(__exports___);
//    __exports___();
//});
//
//
$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });


});
// @TODO will concat file with gulp in the future
//$.getScript(domain.scriptPath+"_forms/_videosForm.js", function(){
//    //require('./_forms/_videosForm');
//});

//require handlebars

require('./../lib/helpers/handlebars-helpers');

require('./_forms/_videosForm.js').videoInit();

//require('./templates/quizzesForm.handlebars');
//MyApp = window['MyApp'] ||{};
//MyApp.templates = window['MyApp'].templates || {};

MyApp = window['MyApp'] ||{};
MyApp = require('./_forms/_quizzesForm.js');



function flash(msg){

}

if($('#buildScorm').length){
    require('./_forms/_scromForm.js').init();
}

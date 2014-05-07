module.exports = function( app ){
    var scorm = require('../controllers/scorm');
    app.param('scormId', scorm.load);
    app.get('/scorm/:scormId/build', scorm.build);
    app.get('/scorm/:scormId/exportSCORM', scorm.exportSCORM);
}

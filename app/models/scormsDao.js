var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ScormSchema = new Schema(
    {

        option : { type: String, default : '', trim : true},
        correct: { type: Boolean, default : false }

    }
);

mongoose.model('Scorm', ScormSchema);

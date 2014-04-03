var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema(
    {
        question: { type : String, default : '', trim : true},
        answers: [{
            option : { type: String, default : '', trim : true},
            correct: { type: Boolean, default : false }
        }],
        correct: { type: String, default : '', trim : true},
        incorrect: { type: Boolean, default : false }
    }
);
mongoose.model('Quiz', QuizSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnswerSchema = new Schema(
    {

        option : { type: String, default : '', trim : true},
        correct: { type: Boolean, default : false }

    }
)
mongoose.model('Answer', AnswerSchema);
var QuizSchema = new Schema(
    {
       questions:[
           {
               question: { type : String, default : '', trim : true},
               answers: [{
                   option : { type: String, default : '', trim : true},
                   correct: { type: Boolean, default : false }
               }],
               correct: { type: String, default : '', trim : true},
               incorrect: { type: Boolean, default : false }

           }
       ],
       replies:[{

           answers:[{
               answer:{type: Schema.ObjectId, ref: 'Answer'},
               reply:{type: Schema.Types.Mixed}
           }],
           answerer:{type: Schema.ObjectId, ref: 'User'}

       }]
    }
);

mongoose.model('Quiz', QuizSchema);
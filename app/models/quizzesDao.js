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
        info: {
            "name": { type: String, default : '"小测试!!"', trim : true},
            "main": { type: String, default : '"小测试!!"', trim : true},
            "results": { type: String, default : '"小测试!!"', trim : true},
            "level1": { type: String, default : '完全掌握理解运用。', trim : true},
            "level2": { type: String, default : '掌握得不错。', trim : true},
            "level3": { type: String, default : '恭喜您，合格了。', trim : true},
            "level4": { type: String, default : '麻麻啦，基本拉车尾。', trim : true},
            "level5": { type: String, default : '仍然需要努力哦...', trim : true},// no comma here
        },
       questions:[
           {
               question: { type : String, default : '', trim : true},
               answers: [{
                   option : { type: String, default : '', trim : true},
                   correct: { type: Boolean, default : false }
               }],
               //answers:[{type: Schema.ObjectId, ref: 'Answer'}],
               //select_any: { type: Boolean, default : true },
               correct: { type: String, default : 'you are right.', trim : true},
               incorrect: { type: String, default : 'you are wrong.', trim : true},

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


/**
 * Methods
 */

QuizSchema.methods = {

    updateQuiz: function (quiz, cb) {



        this.save(cb);


    }
}

module.exports = mongoose.model('Quiz', QuizSchema);

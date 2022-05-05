import QuestionAnswer from "./QuestionAnswer.js";

class QuestionPaper {
    constructor(examId, questionAnswers,maxMarks) {
      
        let questionId = 0;
        this.maxMarks = maxMarks;
        this.examId = examId;
        this.questionAnswers = [];
        questionAnswers.map((qa) => {
            const questionAnswer = new QuestionAnswer(
                qa.question,
                qa.options,
                questionId,
                qa.weightage
            );
            this.questionAnswers.push(questionAnswer);
            questionId++;
        });
    }
    toJson = () => {
        return {
            examId: this.examId,
            questionAnswers: this.questionAnswers,
            maxMarks: this.maxMarks,
        };
    };
}
export default QuestionPaper;
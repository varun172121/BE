import Option from "./Option.js";

class QuestionAnswer {
    constructor(question, options, questionId, weightage) {
        this.questionId = questionId;
        let optionId = 0;
        this.question = question;
        this.weightage = weightage
        this.options = [];
        options.map((option) => {
            const optionObj = new Option(
                optionId,
                option.optionDesc,
                option.isCorrect
            );
            this.options.push(optionObj);
            optionId++;
        });
    }
    toJson = () => {
        return {
            questionId: this.questionId,
            question: this.question,
            options: this.options,
            weightage:this.weightage
        };
    };
}
export default QuestionAnswer;
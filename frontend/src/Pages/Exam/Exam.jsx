import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionPaper } from "../../Api/exam";
import LoadingQuestionPaper from "./ExamComponents/LoadingQuestionPaper";
import QuestionPaper from "./ExamComponents/QuestionPaper";

function Exam({ examId }) {
    const dispatch = useDispatch();
    const { isFetching } = useSelector((state) => state.questionPaper);
    const { examName } = useSelector((state) => state.exam.exam);

    useEffect(() => {
        console.log("Fetching question paper");
        fetchQuestionPaper(dispatch, examId);
    }, [examId, dispatch]);

    if (isFetching) {
        return <LoadingQuestionPaper testName={examName} />;
    } else {
        return <QuestionPaper />;
    }
}

export default Exam;

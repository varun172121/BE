import {
    FETCH_EXAMS_URL,
    FETCH_QUESTION_PAPER,
    SUBMIT_EXAM_RESPONSE,
} from "../Constants/urls";
import { userRequest } from "../requestMethods";
import { snackActions } from "../Utils/SnackBarUtils";
import { setExam, setIsCurrentExamFetching } from "../Features/examSlice";
import {
    setIsQuestionPaperFetching,
    setQuestionList,
} from "../Features/questionPaperSlice";

export const fetchSingleStudentExam = (dispatch, examId) => {
    dispatch(setIsCurrentExamFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            console.log(examId);
            const res = await userRequest.get(
                FETCH_EXAMS_URL + "?examId=" + examId
            );
            dispatch(setExam(res.data));
        } catch (error) {
            dispatch(setIsCurrentExamFetching(false));
            snackActions.error(error.response.data);
        }
    }, 1000);
};

export const fetchQuestionPaper = (dispatch, examId) => {
    dispatch(setIsQuestionPaperFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                FETCH_QUESTION_PAPER + "?examId=" + examId
            );
            let questions = res.data;
            console.log(res.data);
            questions.forEach((question) => {
                question.attempted = false;
                question.markedForReview = false;
            });
            dispatch(setQuestionList(questions));
        } catch (error) {
            dispatch(setIsQuestionPaperFetching(false));
            snackActions.error(error.response.data);
        }
    }, 1000);
};

export const submitAnswers = (dispatch, examId, questions) => {
    dispatch(setIsQuestionPaperFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    const data = {
        examId,
        answers: [],
    };

    questions.forEach((question) => {
        if (question.attempted) {
            data.answers.push({
                questionId: question.questionId,
                userSelection: question.selectedOption,
            });
        }
    });

    setTimeout(async () => {
        try {
            const res = await userRequest.post(SUBMIT_EXAM_RESPONSE, data);
            console.log(res.data);
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setIsQuestionPaperFetching(false));
        }
    }, 1000);
};

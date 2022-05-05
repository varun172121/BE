import {
    FETCH_EXAMS_URL,
    FETCH_QUESTION_PAPER,
    FETCH_RESPONSES_OF_EXAM,
    FETCH_RESPONSES_OF_SINGLE_STUDENT,
    FETCH_STUDENTS_OF_EXAM,
    MALPRACTIC_FETCH_URL,
} from "../Constants/urls";
import { setDashboardFetching } from "../Features/dashboardSlice";
import {
    setEnrolledStudents,
    setMalpracticeImages,
    setSelectedExam,
    setSelectedQuestionPaper,
    setSelectedStudentResponse,
    setStudentResponses,
    setSupervisorExams,
} from "../Features/supervisorSlice";
import { userRequest } from "../requestMethods";
import { snackActions } from "../Utils/SnackBarUtils";

export const createExam = (dispatch, history, examDetails) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.post(FETCH_EXAMS_URL, examDetails);
            snackActions.success(res.data);
            history.push("/dashboard/exam/my-exams");
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const updateExam = (dispatch, history, examDetails) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.put(FETCH_EXAMS_URL, examDetails);
            snackActions.success(res.data);
            history.push("/dashboard/exam/my-exams/" + examDetails.examId);
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const deleteExam = (dispatch, history, examId) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.delete(FETCH_EXAMS_URL, {
                data: { examId },
            });
            snackActions.success(res.data);
            history.push("/dashboard/exam/my-exams");
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const getSupervisorExams = (dispatch) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(FETCH_EXAMS_URL);
            dispatch(setSupervisorExams(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const getExamDetailsForSupervisor = (dispatch, examId) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${FETCH_EXAMS_URL}?examId=${examId}`
            );
            dispatch(setSelectedExam(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const getQuestionPaperForSupervisor = (dispatch, examId) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${FETCH_QUESTION_PAPER}?examId=${examId}`
            );
            dispatch(setSelectedQuestionPaper(res.data));
        } catch (error) {
            if (error.response.status === 400) {
                snackActions.warning("No questions found in question bank.");
            } else {
                snackActions.error(error.response.data);
            }
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const createQuestionPaper = async (
    dispatch,
    history,
    examId,
    questionAnswers
) => {
    dispatch(setDashboardFetching(true));
    try {
        const res = await userRequest.post(FETCH_QUESTION_PAPER, {
            examId,
            questionAnswers,
        });
        getExamDetailsForSupervisor(dispatch, examId);
        snackActions.success(res.data);
        history.push(
            `/dashboard/exam/my-exams/${examId}/manage-question-paper`
        );
    } catch (error) {
        snackActions.error(error.response.data);
    } finally {
        dispatch(setDashboardFetching(false));
    }
};

export const updateQuestionPaper = async (
    dispatch,
    history,
    examId,
    questionPaperId,
    questionAnswers
) => {
    dispatch(setDashboardFetching(true));
    try {
        const res = await userRequest.put(FETCH_QUESTION_PAPER, {
            examId,
            questionPaperId,
            questionAnswers,
        });
        snackActions.success(res.data);
        getQuestionPaperForSupervisor(dispatch, examId);
        history.push(
            `/dashboard/exam/my-exams/${examId}/manage-question-paper`
        );
    } catch (error) {
        snackActions.error(error.response.data);
    } finally {
        dispatch(setDashboardFetching(false));
    }
};

export const getStudentsOfExam = (dispatch, examId) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${FETCH_STUDENTS_OF_EXAM}?examId=${examId}`
            );
            dispatch(setEnrolledStudents(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const deleteStudentFromExam = async (dispatch, examId, studentsList) => {
    dispatch(setDashboardFetching(true));
    try {
        const res = await userRequest.delete(FETCH_STUDENTS_OF_EXAM, {
            data: { examId: examId, studentsList: studentsList },
        });
        getStudentsOfExam(dispatch, examId);
        snackActions.success(res.data);
    } catch (error) {
        console.log(error);
        snackActions.error(error.response.data);
    } finally {
        dispatch(setDashboardFetching(false));
    }
};

export const addStudentToExam = (dispatch, history, examId, studentIds) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.post(FETCH_STUDENTS_OF_EXAM, {
                examId: examId,
                studentsList: studentIds,
            });
            history.push(`/dashboard/exam/my-exams/${examId}/manage-students`);
            if (res.data.length > 0) {
                snackActions.warning(
                    "Some students were not enrolled - " + res.data
                );
            } else {
                snackActions.success("Students enrolled successfully");
            }
        } catch (error) {
            console.log("there was some error");
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const getStudentResponses = (dispatch, examId) => {
    dispatch(setDashboardFetching(true));
    // Timeout to prevent loading bar vanishing too fast
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${FETCH_RESPONSES_OF_EXAM}?examId=${examId}`
            );
            dispatch(setStudentResponses(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const fetchSingleStudentResponseForSupervisor = async (
    dispatch,
    examId,
    studentId
) => {
    dispatch(setDashboardFetching(true));
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${FETCH_RESPONSES_OF_SINGLE_STUDENT}?examId=${examId}&studentId=${studentId}`
            );
            console.log(res.data);
            dispatch(setSelectedStudentResponse(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

export const fetchMalpracticeByType = async (
    dispatch,
    examId,
    studentId,
    type
) => {
    dispatch(setDashboardFetching(true));
    setTimeout(async () => {
        try {
            const res = await userRequest.get(
                `${MALPRACTIC_FETCH_URL}?examId=${examId}&studentId=${studentId}&malpracticeType=${type}`
            );
            console.log(res.data);
            dispatch(setMalpracticeImages(res.data));
        } catch (error) {
            snackActions.error(error.response.data);
        } finally {
            dispatch(setDashboardFetching(false));
        }
    }, 1000);
};

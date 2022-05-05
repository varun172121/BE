// Root URL
export const URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080/api"
        : "https://examinator-ai.southindia.cloudapp.azure.com/api";

// Auth
export const STUDENT_REGISTER_URL = "/user/register-student";
export const SUPERVISOR_REGISTER_URL = "/user/register-supervisor";
export const LOGIN_URL = "/user/login";
export const LOGOUT_URL = "/user/logout";
export const CHANGE_PASSWORD = "/user/change-password";

// Exam
export const FETCH_EXAMS_URL = "/exam";
export const FETCH_UPCOMING_EXAM_URL = "/exam/upcoming";
export const FETCH_PAST_EXAM_URL = "/exam/history";
export const FETCH_CURRENT_EXAM_URL = "/exam/current";
export const FETCH_QUESTION_PAPER = "/exam/question-paper";
export const SUBMIT_EXAM_RESPONSE = "/exam/submit-answer";
export const FETCH_STUDENTS_OF_EXAM = "/exam/students";
export const FETCH_RESPONSES_OF_EXAM = "/exam/responses";
export const FETCH_RESPONSES_OF_SINGLE_STUDENT = "/exam/student";
export const MALPRACTIC_FETCH_URL = "/exam/malpractice";

// Proctor
export const UPLOAD_FACE_URL = "/proctor/upload-face";
export const MALPRACTICE_URL = "/proctor/malpractices";

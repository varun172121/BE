import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    exams: [],
    selectedExam: {},
    selectedQuestionPaper: [],
    selectedQuestionId: 0,
    selectedStudent: {
        studentId: "",
        studentName: "",
    },
    supervisorDialogOpen: false,
    enrolledStudents: [],
    unsavedChanges: false,
    studentResponses: {},
    selectedStudentResponse: {},
    malpracticeImages: [],
};

const supervisorSlice = createSlice({
    name: "supervisor",
    initialState: initialState,
    reducers: {
        setSupervisorExams: (state, action) => {
            state.exams = action.payload;
        },
        setSelectedExam: (state, action) => {
            state.selectedExam = action.payload;
        },
        setSelectedQuestionPaper: (state, action) => {
            state.selectedQuestionPaper = action.payload;
        },
        addQuestionToQuestionPaper: (state, action) => {
            state.selectedQuestionPaper.push(action.payload);
        },
        setSelectedQuestionId: (state, action) => {
            state.selectedQuestionId = action.payload;
        },
        setSelectedStudent: (state, action) => {
            state.selectedStudent = action.payload;
        },
        setSupervisorDialogOpen: (state, action) => {
            state.supervisorDialogOpen = action.payload;
        },
        setEnrolledStudents: (state, action) => {
            state.enrolledStudents = action.payload;
        },
        setUnsavedChanges: (state, action) => {
            state.unsavedChanges = action.payload;
        },
        setStudentResponses: (state, action) => {
            state.studentResponses = action.payload;
        },
        setSelectedStudentResponse: (state, action) => {
            state.selectedStudentResponse = action.payload;
        },
        setMalpracticeImages: (state, action) => {
            state.malpracticeImages = action.payload;
        },
        resetSupervisor: () => initialState,
    },
});

export const {
    setSupervisorExams,
    setSelectedExam,
    setSelectedQuestionPaper,
    addQuestionToQuestionPaper,
    setSelectedQuestionId,
    setSelectedStudent,
    setSupervisorDialogOpen,
    setEnrolledStudents,
    setUnsavedChanges,
    setStudentResponses,
    setSelectedStudentResponse,
    setMalpracticeImages,
    resetSupervisor,
} = supervisorSlice.actions;
export default supervisorSlice.reducer;

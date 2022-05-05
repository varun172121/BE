import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    exams: {
        upcoming: [],
        history: [],
        current: [],
    },
};

const studentSlice = createSlice({
    name: "student",
    initialState: initialState,
    reducers: {
        setUpcomingExams: (state, action) => {
            state.exams.upcoming = action.payload;
        },
        setHistoryExams: (state, action) => {
            state.exams.history = action.payload;
        },
        setCurrentExams: (state, action) => {
            state.exams.current = action.payload;
        },
        resetStudent: () => initialState,
    },
});

export const {
    setUpcomingExams,
    setHistoryExams,
    setCurrentExams,
    resetStudent,
} = studentSlice.actions;
export default studentSlice.reducer;

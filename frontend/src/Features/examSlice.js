import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    exam: {},
    isFetching: false,
};

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        setExam: (state, action) => {
            state.exam = action.payload;
            state.isFetching = false;
        },
        setIsCurrentExamFetching: (state, action) => {
            state.isFetching = action.payload;
        },
        resetExam: () => initialState,
    },
});

export const { setExam, setIsCurrentExamFetching, resetExam } = examSlice.actions;
export default examSlice.reducer;
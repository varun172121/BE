import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Features/userSlice";
import studentSlice from "./Features/studentSlice";
import dashboardSlice from "./Features/dashboardSlice";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import questionPaperSlice from "./Features/questionPaperSlice";
import examSlice from "./Features/examSlice";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";
import supervisorSlice from "./Features/supervisorSlice";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["user", "supervisor", "student"],
};

const persistedReducer = persistCombineReducers(persistConfig, {
    user: userSlice,
    dashboard: dashboardSlice,
    student: studentSlice,
    supervisor: supervisorSlice,
    questionPaper: questionPaperSlice,
    exam: examSlice,
});

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

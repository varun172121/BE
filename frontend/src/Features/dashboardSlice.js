import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "Dashboard",
    mobileOpen: false,
    isFetching: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initialState,
    reducers: {
        setDashboardFetching: (state, action) => {
            state.isFetching = action.payload;
        },
        setDashboardTitle: (state, action) => {
            state.title = action.payload;
        },
        setMobileOpen: (state) => {
            state.mobileOpen = !state.mobileOpen;
        },
        resetDashboard: () => initialState,
    },
});

export const {
    setDashboardTitle,
    setMobileOpen,
    resetDashboard,
    setDashboardFetching,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;

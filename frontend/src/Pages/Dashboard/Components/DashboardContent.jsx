import React, { useEffect } from "react";
import { drawerWidth } from "../../../Constants/sizes";
import { Toolbar, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardTitle } from "../../../Features/dashboardSlice";

function DashboardContent(props) {
    const dispatch = useDispatch();
    const { title } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(setDashboardTitle(props.title));
    }, [dispatch, props.title]);

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                bgcolor: "whitesmoke",
                minHeight: "100vh",
            }}
        >
            <Toolbar />
            <Typography variant="h5" mb={3} fontWeight="fontWeightMedium">
                {title}
            </Typography>
            {props.children}
        </Box>
    );
}

export default DashboardContent;

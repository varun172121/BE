import { useMediaQuery } from "@mui/material";
import React from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import MobileExamError from "../Pages/Errors/MobileExamError";
import { useTheme } from "@mui/material/styles";

const ProtectedRoute = (props) => {
    const theme = useTheme();
    const { desktopOnly, children, ...rest } = props;
    const user = useSelector((state) => state.user.currentUser);
    const matches = useMediaQuery(theme.breakpoints.down("lg"));
    // TODO: Implement cookie based authentication

    if (desktopOnly) {
        if (isMobile || matches) {
            return <MobileExamError />;
        }
    }

    if (!user) {
        return <Redirect to="/login" />;
    }

    return <Route {...rest}>{children}</Route>;
};

export default ProtectedRoute;

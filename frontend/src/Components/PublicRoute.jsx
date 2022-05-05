import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PublicRoute = (props) => {
    const { children, ...rest } = props;
    const user = useSelector((state) => state.user.currentUser);

    if (user) {
        return <Redirect to="/dashboard" />;
    }

    return <Route {...rest}>{children}</Route>;
};

export default PublicRoute;

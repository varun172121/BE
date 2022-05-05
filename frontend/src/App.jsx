import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./Themes/theme";
import { Switch, Route } from "react-router-dom";
import {
    Dashboard,
    Home,
    Login,
    Register,
    NotFoundError,
    ExamRoutes,
} from "./Pages/index";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "./Utils/SnackBarUtils";
import ProtectedRoute from "./Components/ProtectedRoute";
import "react-image-lightbox/style.css";
import PublicRoute from "./Components/PublicRoute";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                maxSnack={2}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <SnackbarUtilsConfigurator />
                <CssBaseline />
                <Switch>
                    <ProtectedRoute path="/dashboard">
                        <Dashboard />
                    </ProtectedRoute>
                    <PublicRoute path="/login">
                        <Login />
                    </PublicRoute>
                    <PublicRoute path="/register">
                        <Register />
                    </PublicRoute>
                    <ProtectedRoute path="/take-exam/:id" desktopOnly>
                        <ExamRoutes />
                    </ProtectedRoute>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route>
                        <NotFoundError />
                    </Route>
                </Switch>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;

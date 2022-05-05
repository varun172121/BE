import React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import SupervisorGetStarted from "../../Assets/Images/supervisor.svg";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

function GetStarted() {
    const user = useSelector((state) => state.user.currentUser);

    const getStarted = (
        <Grid item>
            <Button
                fullWidth
                size="large"
                color="secondary"
                component={Link}
                to="/register"
                startIcon={<AddIcon />}
            >
                Create a new account Now
            </Button>
        </Grid>
    );

    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{ py: 6 }}
            >
                <Grid item>
                    <Typography variant="button" textAlign="center">
                        Get Started
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h3"
                        fontWeight="fontWeightBold"
                        maxWidth="md"
                        textAlign="center"
                    >
                        Getting Started with Examinator is Easy
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h6"
                        maxWidth="lg"
                        textAlign="center"
                        color="text.secondary"
                    >
                        Just register yourself as a student or a supervisor. Go
                        to Sign Up and fill your details accordingly.
                        Supervisors can create and manage examinations. Students
                        can appear for examinations.
                    </Typography>
                </Grid>
                <Grid item sx={{ my: 2 }}>
                    <Container maxWidth="sm">
                        <img
                            src={SupervisorGetStarted}
                            alt=""
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Container>
                </Grid>
                {!user && getStarted}
            </Grid>
        </>
    );
}

export default GetStarted;

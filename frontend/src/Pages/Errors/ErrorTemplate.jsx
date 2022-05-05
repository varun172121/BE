import React from "react";
import { Grid, Typography } from "@mui/material";

function ErrorTemplate(props) {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            height="100vh"
            spacing={2}
        >
            <Grid
                item
                xs
                justifyContent="center"
                sx={{ mt: { xs: 5, md: 10 }, mb: { xs: 2, md: 4 } }}
            >
                <img src={props.image} alt="error" style={{ height: "40vh" }} />
            </Grid>
            <Grid item xs textAlign="center">
                <Typography variant="h4" fontWeight="fontWeightBold">{props.title}</Typography>
                <Typography
                    variant="h6"
                    textAlign="center"
                    maxWidth="sm"
                    px={2}
                    mt={3}
                >
                    {props.children}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default ErrorTemplate;

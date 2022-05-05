import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const LoadingQuestionPaper = ({ testName }) => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Stack sx={{ m: "auto" }} alignItems="center" spacing={3}>
                <Typography variant="h4" color="primary.dark">
                    Loading {testName}
                </Typography>
                <CircularProgress color="secondary" />
            </Stack>
        </Box>
    );
};

LoadingQuestionPaper.propTypes = {
    testName: PropTypes.string.isRequired,
};

export default LoadingQuestionPaper;

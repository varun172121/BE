import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswers } from "../../Api/exam";

const ExamSubmitPage = () => {
    const dispatch = useDispatch();
    const { isFetching, questions } = useSelector(
        (state) => state.questionPaper
    );
    const { examId } = useSelector((state) => state.exam.exam);

    useEffect(() => {
        console.log("Response is being submittted...");
        submitAnswers(dispatch, examId, questions);
    }, [dispatch, examId, questions]);

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
                    {isFetching
                        ? "Submitting your response ..."
                        : "Your response has been submitted."}
                </Typography>
                {isFetching ? (
                    <CircularProgress color="secondary" />
                ) : (
                    <Button
                        color="success"
                        size="large"
                        component={Link}
                        to="/dashboard"
                    >
                        Back to Dashboard
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ExamSubmitPage;

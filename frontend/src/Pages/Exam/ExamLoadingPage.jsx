import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleStudentExam } from "../../Api/exam";
import PreExamInstructions from "./PreExamInstructions";

const ExamLoadingPage = ({ id }) => {
    const { isFetching } = useSelector((state) => state.exam);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Exam is fetching...");
        fetchSingleStudentExam(dispatch, id);
    }, [id, dispatch]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {isFetching ? (
                <Stack sx={{ m: "auto" }} alignItems="center" spacing={3}>
                    <Typography
                        variant="h4"
                        fontWeight="fontWeightBold"
                        color="primary.dark"
                    >
                        EXAMINATOR
                    </Typography>
                    <CircularProgress color="secondary" />
                </Stack>
            ) : (
                <PreExamInstructions />
            )}
        </Box>
    );
};

export default ExamLoadingPage;

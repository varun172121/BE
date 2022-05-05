import { Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import QuestionForm from "../Common/QuestionForm";

const AddQuestion = () => {
    const { examName } = useSelector((state) => state.supervisor.selectedExam);
    const { examId } = useParams();

    return (
        <>
            <Breadcrumbs sx={{ mb: 3 }} separator=">">
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to="/dashboard/exam/my-exams"
                >
                    My Exams
                </Link>
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to={`/dashboard/exam/my-exams/${examId}`}
                >
                    {examName}
                </Link>
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to={`/dashboard/exam/my-exams/${examId}/manage-question-paper`}
                >
                    Manage Question Bank
                </Link>
                <Typography>Add Question</Typography>
            </Breadcrumbs>
            <QuestionForm />
        </>
    );
};

export default AddQuestion;

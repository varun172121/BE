import {
    Box,
    Breadcrumbs,
    Button,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Link as RouterLink, useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addStudentToExam } from "../../../../Api/supervisor";

const EnrollStudents = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { examName, examId } = useSelector(
        (state) => state.supervisor.selectedExam
    );

    const onSubmit = (data) => {
        let studentIds = data.studentList.split(",");
        studentIds = studentIds.map((studentId) => studentId.trim());
        addStudentToExam(dispatch, history, examId, studentIds);
    };

    const { isFetching } = useSelector((state) => state.dashboard);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                    to={`/dashboard/exam/my-exams/${examId}/manage-students`}
                >
                    Manage Students
                </Link>
                <Typography>Enroll Students</Typography>
            </Breadcrumbs>
            <Paper sx={{ p: 3 }} elevation={4}>
                <TextField
                    label="Enter Comma Separated Student Email IDs"
                    fullWidth
                    multiline
                    rows={8}
                    {...register("studentList", { required: true })}
                    error={!!errors.studentList}
                    helperText={
                        errors.studentList && "Student Email IDs are required"
                    }
                />

                <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
                    <Button
                        color="success"
                        size="large"
                        type="submit"
                        disabled={isFetching}
                    >
                        Add Students
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default EnrollStudents;

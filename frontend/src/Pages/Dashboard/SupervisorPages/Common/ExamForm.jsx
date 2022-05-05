import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    ThemeProvider,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createExamValidation } from "../../../../Validations/createExamValidation";
import { useDispatch, useSelector } from "react-redux";
import { createExam, deleteExam, updateExam } from "../../../../Api/supervisor";
import { useHistory } from "react-router-dom";
import MUIRichTextEditor from "mui-rte";
import { convertToRaw } from "draft-js";
import PropTypes from "prop-types";
import theme from "../../../../Themes/rte_theme";
import { setSupervisorDialogOpen } from "../../../../Features/supervisorSlice";
import CustomCard from "../../../../Components/CustomCard";
import InfoIcon from "@mui/icons-material/Info";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DeleteConfirmationDialog = () => {
    const { supervisorDialogOpen, selectedExam } = useSelector(
        (state) => state.supervisor
    );
    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <Dialog
            open={supervisorDialogOpen}
            onClose={() => dispatch(setSupervisorDialogOpen(false))}
        >
            <DialogTitle>Delete Exam</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete this exam?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    onClick={() => dispatch(setSupervisorDialogOpen(false))}
                >
                    Cancel
                </Button>
                <Button
                    variant="text"
                    onClick={() => {
                        dispatch(setSupervisorDialogOpen(false));
                        deleteExam(dispatch, history, selectedExam.examId);
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ExamForm = ({ edit }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { isFetching } = useSelector((state) => state.dashboard);
    const { selectedExam } = useSelector((state) => state.supervisor);
    const [startDate, setStartDate] = useState(
        edit ? DateTime.fromISO(selectedExam.examStartTime) : DateTime.now()
    );
    const [endDate, setEndDate] = useState(
        edit
            ? DateTime.fromISO(selectedExam.examEndTime)
            : DateTime.now().plus({ minute: 1 })
    );
    const [deleteAvailable, setDeleteAvailable] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(createExamValidation),
        defaultValues: {
            examName: edit ? selectedExam.examName : "",
            examDesc: edit ? selectedExam.examDesc : "",
            examInstructions: edit ? selectedExam.examInstructions : "",
        },
    });

    useEffect(() => {
        register("examInstructions");
        setDeleteAvailable(
            DateTime.now() > DateTime.fromISO(selectedExam.examStartTime) &&
                DateTime.now() < DateTime.fromISO(selectedExam.examEndTime)
        );
    }, [register, selectedExam.examStartTime, selectedExam.examEndTime]);

    const onSubmit = (data) => {
        const finalData = {
            ...data,
            examStartTime: startDate.toISO(),
            examEndTime: endDate.toISO(),
        };
        console.log(finalData);
        // createExam(dispatch, history, finalData);
        if (edit) {
            updateExam(dispatch, history, {
                ...finalData,
                examId: selectedExam.examId,
            });
        } else {
            createExam(dispatch, history, finalData);
        }
    };

    const muiRteProps = {
        label: "Start typing here...",
        onChange: (value) => {
            const content = convertToRaw(value.getCurrentContent());
            setValue("examInstructions", content);
        },
    };

    if (edit) {
        muiRteProps.defaultValue = JSON.stringify(
            selectedExam.examInstructions
        );
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <DeleteConfirmationDialog />
            <Grid container spacing={3}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Stack spacing={4}>
                        <CustomCard title="Exam Details" icon={<InfoIcon />}>
                            <Stack spacing={2}>
                                {edit && (
                                    <TextField
                                        name="examName"
                                        label="Exam ID"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={selectedExam.examId}
                                        fullWidth
                                    />
                                )}
                                <TextField
                                    label="Exam Name"
                                    {...register("examName")}
                                    error={!!errors.examName}
                                    helperText={
                                        errors.examName &&
                                        errors.examName.message
                                    }
                                    fullWidth
                                />
                                <TextField
                                    name="examDesc"
                                    label="Exam Description"
                                    multiline
                                    rows={4}
                                    {...register("examDesc")}
                                    error={!!errors.examDesc}
                                    helperText={
                                        errors.examDesc &&
                                        errors.examDesc.message
                                    }
                                    fullWidth
                                />
                            </Stack>
                        </CustomCard>
                        <CustomCard
                            title="Exam Instructions"
                            icon={<EventNoteIcon />}
                        >
                            <Grid item xs={12}>
                                <ThemeProvider theme={theme}>
                                    <MUIRichTextEditor {...muiRteProps} />
                                </ThemeProvider>
                            </Grid>
                        </CustomCard>
                    </Stack>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <CustomCard title="Exam Timings" icon={<AccessTimeIcon />}>
                        <Stack spacing={2}>
                            <DateTimePicker
                                label="Starts From"
                                renderInput={(props) => (
                                    <TextField {...props} fullWidth />
                                )}
                                value={startDate}
                                minDateTime={edit ? startDate : DateTime.now()}
                                onChange={setStartDate}
                            />

                            <DateTimePicker
                                label="Ends At"
                                renderInput={(props) => (
                                    <TextField {...props} fullWidth />
                                )}
                                value={endDate}
                                minDateTime={startDate.plus({ minute: 1 })}
                                onChange={setEndDate}
                            />
                        </Stack>
                    </CustomCard>
                    <Button
                        fullWidth
                        color="success"
                        sx={{ mt: 3 }}
                        size="large"
                        type="submit"
                        disabled={isFetching}
                    >
                        {edit ? "Update Exam Details" : "Create Exam"}
                    </Button>
                    {edit && (
                        <Button
                            fullWidth
                            color="error"
                            sx={{ mt: 1 }}
                            size="large"
                            disabled={isFetching || deleteAvailable}
                            onClick={() => {
                                dispatch(setSupervisorDialogOpen(true));
                            }}
                        >
                            Delete Exam
                        </Button>
                    )}
                </Grid>
            </Grid>
            <Box sx={{ py: 8 }} />
        </Box>
    );
};

ExamForm.propTypes = {
    edit: PropTypes.bool,
};

export default ExamForm;

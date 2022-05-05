import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSubmitDialogOpen } from "../../../Features/questionPaperSlice";
import { Redirect } from "react-router-dom";

const SubmitDialog = () => {
    const dispatch = useDispatch();
    const [accepted, setAccepted] = useState(false);
    const { submitDialogOpen } = useSelector((state) => state.questionPaper);
    const { examId } = useSelector((state) => state.exam.exam);
    const handleClose = () => dispatch(setSubmitDialogOpen(false));
    const handleSubmit = () => setAccepted(true);

    if (accepted) {
        dispatch(setSubmitDialogOpen(false));
        return <Redirect to={`/take-exam/${examId}/submit`} />;
    }

    return (
        <Dialog
            open={submitDialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Finish Test</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to finish this test? Your answers will
                    be submitted.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="text">
                    No
                </Button>
                <Button onClick={handleSubmit} variant="text" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmitDialog;

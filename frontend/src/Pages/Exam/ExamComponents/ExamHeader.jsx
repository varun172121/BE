import React from "react";
import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import PropTypes from "prop-types";
import SubmitDialog from "./SubmitDialog";
import { useDispatch } from "react-redux";
import { setSubmitDialogOpen } from "../../../Features/questionPaperSlice";
import { useTimer } from "react-timer-hook";
import { useSelector } from "react-redux";
import { DateTime } from "luxon";

function ExamHeader(props) {
    const dispatch = useDispatch();
    const { userId, examName } = props;
    const handleClickOpen = () => {
        dispatch(setSubmitDialogOpen(true));
    };
    const { examEndTime } = useSelector((state) => state.exam.exam);
    console.log(examEndTime);
    const { seconds, minutes, hours, days } = useTimer({
        expiryTimestamp: DateTime.fromISO(examEndTime).toJSDate(),
        onExpire: () => console.log("expired"),
    });

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{ py: 1 }}
            >
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={4}>
                            <Typography
                                variant="h6"
                                fontWeight="fontWeightBold"
                                noWrap
                            >
                                {examName}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: -1 }}>
                                {"Candidate ID: " + userId}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            direction="row"
                            justifyContent="center"
                            spacing={1}
                        >
                            <Grid item>
                                <AccessAlarmIcon color="primary" />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mr: 2 }}
                                    textAlign="center"
                                >
                                    {`Time Remaining: ${days}:${hours}:${minutes}:${seconds}`}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} textAlign="end">
                            <Button
                                color="success"
                                size="large"
                                onClick={handleClickOpen}
                            >
                                Finish Test
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <SubmitDialog />
        </Box>
    );
}

ExamHeader.propTypes = {
    userId: PropTypes.string.isRequired,
    examName: PropTypes.string.isRequired,
};

export default ExamHeader;

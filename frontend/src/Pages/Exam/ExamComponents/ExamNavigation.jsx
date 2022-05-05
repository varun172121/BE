import React from "react";
import { Grid, Button, Typography, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { setCurrentQuestionId } from "../../../Features/questionPaperSlice";

function ExamNavigation() {
    const dispatch = useDispatch();
    const { questions } = useSelector((state) => state.questionPaper);

    return (
        <Grid container direction="column">
            <Grid item xs>
                <Typography variant="body1" fontWeight="fontWeightBold">
                    Question Summary
                </Typography>
                <SimpleBar style={{ maxHeight: 300 }}>
                    <Grid container spacing={2} mt={1}>
                        {questions.map((question, index) => (
                            <Grid item key={question.questionId}>
                                <Button
                                    color={
                                        question.markedForReview
                                            ? "info"
                                            : question.attempted
                                            ? "success"
                                            : "error"
                                    }
                                    disableElevation
                                    onClick={() =>
                                        dispatch(
                                            setCurrentQuestionId(
                                                question.questionId
                                            )
                                        )
                                    }
                                >
                                    {index + 1}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </SimpleBar>
                <Divider sx={{ my: 2, width: "85%" }} />
            </Grid>
            <Grid item xs>
                <Typography variant="body1" mb={2} fontWeight="fontWeightBold">
                    Legend
                </Typography>
                <Grid container spacing={1}>
                    <Grid item container alignItems="center">
                        <Grid item xs={4}>
                            <Button
                                color="error"
                                disableElevation
                                disableRipple
                            >
                                1
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1">
                                Not Attempted
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center">
                        <Grid item xs={4}>
                            <Button
                                color="success"
                                disableElevation
                                disableRipple
                            >
                                2
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1">Attempted</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center">
                        <Grid item xs={4}>
                            <Button color="info" disableElevation disableRipple>
                                3
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1">
                                Marked for Review
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ExamNavigation;

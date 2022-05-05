import React from "react";
import { Button, Container, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useDispatch } from "react-redux";
import {
    setCurrentQuestionId,
    setQuestionMarkedForReview,
    setSubmitDialogOpen,
} from "../../../Features/questionPaperSlice";
import PropTypes from "prop-types";
import SubmitDialog from "./SubmitDialog";

function ExamFooter(props) {
    const dispatch = useDispatch();
    const { currentQuestionId, totalQuestions, currentQuestion } = props;

    return (
        <Grid item container spacing={0}>
            <Grid item xs={10} textAlign="end" container>
                <Grid item xs textAlign="start">
                    <Container>
                        <Button
                            variant="outlined"
                            color={
                                currentQuestion.markedForReview
                                    ? "error"
                                    : "primary"
                            }
                            endIcon={<BookmarkIcon />}
                            size="large"
                            onClick={() => {
                                dispatch(setQuestionMarkedForReview());
                            }}
                        >
                            {currentQuestion.markedForReview
                                ? "Remove Mark from Review"
                                : "Mark for Review"}
                        </Button>
                    </Container>
                </Grid>
                <Grid item xs>
                    <Container>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            disabled={currentQuestionId === 0}
                            onClick={() => {
                                dispatch(
                                    setCurrentQuestionId(currentQuestionId - 1)
                                );
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            size="large"
                            sx={{ ml: 3 }}
                            endIcon={<ArrowForwardIcon />}
                            color={
                                currentQuestionId === totalQuestions - 1
                                    ? "success"
                                    : "primary"
                            }
                            onClick={
                                currentQuestionId === totalQuestions - 1
                                    ? () => {
                                          dispatch(setSubmitDialogOpen(true));
                                      }
                                    : () => {
                                          dispatch(
                                              setCurrentQuestionId(
                                                  currentQuestionId + 1
                                              )
                                          );
                                      }
                            }
                        >
                            {currentQuestionId === totalQuestions - 1
                                ? "Submit"
                                : "Next"}
                        </Button>
                        <SubmitDialog />
                    </Container>
                </Grid>
            </Grid>
        </Grid>
    );
}

ExamFooter.propTypes = {
    currentQuestionId: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    currentQuestion: PropTypes.object.isRequired,
};

export default ExamFooter;

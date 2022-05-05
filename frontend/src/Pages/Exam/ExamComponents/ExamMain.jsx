import {
    Card,
    Container,
    FormControlLabel,
    Grid,
    Radio,
    Stack,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ExamNavigation from "./ExamNavigation";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setQuestionAttempted } from "../../../Features/questionPaperSlice";
import SimpleBar from "simplebar-react";
import MUIRichTextEditor from "mui-rte";

function ExamMain(props) {
    const dispatch = useDispatch();
    const {
        currentQuestionId,
        totalQuestions,
        question,
        options,
        selectedOption,
        weightage,
    } = props;

    return (
        <Grid container sx={{ pt: 2 }}>
            <Grid item xs={5}>
                <Container>
                    <Stack>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                            Question {currentQuestionId + 1} of {totalQuestions}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            ({weightage} Marks)
                        </Typography>
                        <Box
                            sx={{
                                maxHeight: "70vh",
                                overflow: "auto",
                                pr: 1,
                                pb: 1,
                            }}
                        >
                            <MUIRichTextEditor
                                value={question}
                                readOnly
                                toolbar={false}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Grid>
            <Grid item xs={5}>
                <Card sx={{ p: 3, mr: 10 }} variant="outlined">
                    <Typography
                        variant="body1"
                        fontWeight="fontWeightBold"
                        gutterBottom
                    >
                        Options
                    </Typography>
                    <SimpleBar style={{ maxHeight: "70vh" }}>
                        <Stack>
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.optionId}
                                    value={option.optionId.toString()}
                                    control={<Radio />}
                                    label={option.optionDesc}
                                    checked={option.optionId === selectedOption}
                                    onClick={() => {
                                        dispatch(
                                            setQuestionAttempted(
                                                option.optionId
                                            )
                                        );
                                    }}
                                />
                            ))}
                        </Stack>
                    </SimpleBar>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <ExamNavigation />
            </Grid>
        </Grid>
    );
}

ExamMain.propTypes = {
    currentQuestionId: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            optionId: PropTypes.number.isRequired,
            optionDesc: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedOption: PropTypes.number,
    weightage: PropTypes.number.isRequired,
};

export default ExamMain;

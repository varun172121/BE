import React from "react";
import { Grid } from "@mui/material";
import ExamHeader from "./ExamHeader";
import ExamMain from "./ExamMain";
import ExamFooter from "./ExamFooter";
import { useSelector } from "react-redux";
import LoadAI from "../AI/LoadAI";
import Hotkeys from "react-hot-keys";
import { snackActions } from "../../../Utils/SnackBarUtils";
import PageVisibility from 'react-page-visibility';
import { sendExamEvent } from "../../../Api/proctor";
import { useParams } from "react-router-dom";



const QuestionPaper = () => {
    const { id } = useParams();
    const { userId } = useSelector((state) => state.user.currentUser);
    const { exam } = useSelector((state) => state.exam);
    const { currentQuestionId, questions, totalQuestions } = useSelector(
        (state) => state.questionPaper
    );
    const handleVisibilityChange=isVisible=>{
        if(!isVisible){
            snackActions.warning("You are not in the exam window. Please return to the exam window to continue.");
            sendExamEvent("", id, "SCREEN_CHANGED");    
        }
}

    return (
        questions.length > 0 && (
            <PageVisibility onChange={handleVisibilityChange}>
            <Hotkeys
            keyName="shift+a,alt+s,ctrl+shift+k,f10,alt+tab,ctrl+shift+i"
            onKeyDown={(keyName, e, handle) =>{
                e.preventDefault();
                snackActions.warning(keyName +" is not allowed. You are monitored")
              }}
          >
            <Grid
                height="100vh"
                direction="column"
                spacing={0}
                justifyContent="space-between"
                container
            >
                <Grid item>
                    <ExamHeader userId={userId} examName={exam.examName} />
                    <ExamMain
                        currentQuestionId={currentQuestionId}
                        question={questions[currentQuestionId].question}
                        options={questions[currentQuestionId].options}
                        totalQuestions={totalQuestions}
                        selectedOption={
                            questions[currentQuestionId].selectedOption
                        }
                        weightage={questions[currentQuestionId].weightage}
                    />
                </Grid>
                <Grid item container py={3}>
                    <ExamFooter
                        currentQuestion={questions[currentQuestionId]}
                        currentQuestionId={currentQuestionId}
                        totalQuestions={totalQuestions}
                    />
                </Grid>
                <LoadAI examId={exam.examId}/>
            </Grid>
            </Hotkeys>
            </PageVisibility>
        )
    );
};

export default QuestionPaper;

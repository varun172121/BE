import React from "react";
import { useParams } from "react-router-dom";
import QuestionForm from "../Common/QuestionForm";

const EditQuestion = () => {
    const { qid } = useParams();
    return <QuestionForm edit qid={qid} />;
};

export default EditQuestion;

import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import AddQuestion from "./MyExams/AddQuestion";
import EditExam from "./MyExams/EditExam";
import EditQuestion from "./MyExams/EditQuestion";
import EnrollStudents from "./MyExams/EnrollStudents";
import MalpracticeImages from "./MyExams/MalpracticeImages";
import ManageExam from "./MyExams/ManageExam";
import ManageQuestionPaper from "./MyExams/ManageQuestionPaper";
import ManageStudents from "./MyExams/ManageStudents";
import MyExamsList from "./MyExams/MyExamsList";
import ViewResponses from "./MyExams/ViewResponses";
import ViewStudentResponse from "./MyExams/ViewStudentResponse";
import ProtectedRoute from "../../../Components/ProtectedRoute";

const MyExams = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <ProtectedRoute path={`${path}/:examId/manage-question-paper/edit-question/:qid`}>
                <EditQuestion />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/manage-question-paper/add-question`}>
                <AddQuestion />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/manage-question-paper`}>
                <ManageQuestionPaper />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/manage-students/enroll-students`}>
                <EnrollStudents />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/manage-students`}>
                <ManageStudents />
            </ProtectedRoute>
            <ProtectedRoute
                path={`${path}/:examId/view-responses/:studentId/view-incidents/:type`}
            >
                <MalpracticeImages />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/view-responses/:studentId`}>
                <ViewStudentResponse />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/view-responses`}>
                <ViewResponses />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId/edit-exam`}>
                <EditExam />
            </ProtectedRoute>
            <ProtectedRoute path={`${path}/:examId`}>
                <ManageExam />
            </ProtectedRoute>
            <ProtectedRoute path={path}>
                <MyExamsList />
            </ProtectedRoute>
        </Switch>
    );
};

export default MyExams;

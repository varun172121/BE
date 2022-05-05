import { firebase_firestore } from "../db.js";
import * as config from "../config.js";
import CryptoJs from "crypto-js";
import User from "../models/User.js";
import { userExists, userExistsFunction } from "../helpers/users.js";
import jwt from "jsonwebtoken";
import Exam from "../models/Exam.js";
import { uid } from "../helpers/other.js";
import admin from "firebase-admin";
import QuestionPaper from "../models/QuestionPaper.js";
import {
    examAccess,
    hasSubmitted,
    inTime,
    questionPaperExists,
    questionPaperFromExam,
} from "../helpers/exams.js";
import { ExamAndSupervisor } from "../helpers/auth.js";
import { sendMail } from "../helpers/email.js";
import { DateTime } from "luxon";
// import { DateTime } from "luxon";
const fieldValue = admin.firestore.FieldValue;

// CRUD EXAMS

const createExam = async (req, res) => {
    try {
        const newId = uid();
        const newExam = new Exam(
            newId,
            req.user.userId,
            req.body.examName,
            req.body.examStartTime,
            req.body.examEndTime,
            req.body.examDesc,
            req.body.examInstructions
        );
        const examJson = JSON.parse(JSON.stringify(newExam));
        const result = await firebase_firestore
            .collection("exams")
            .doc(newId)
            .create(examJson);
        // await firebase_firestore.collection('users').doc(req.user.userId).set({examsCreated:presentExamsCreated},{merge:true})
        await firebase_firestore
            .collection("users")
            .doc(req.user.userId)
            .update({
                examsCreated: fieldValue.arrayUnion(newId),
            });

        res.status(200).json("Exam Created Successfully!");
    } catch (error) {
        return res.status(500).json("Failed to create exam " + error);
    }
};
const updateExam = async (req, res) => {
    try {
        const studentsList = await (
            await firebase_firestore
                .collection("exams")
                .doc(req.body.examId)
                .get()
        ).data()["studentsList"];
        const newExam = new Exam(
            req.body.examId,
            req.user.userId,
            req.body.examName,
            req.body.examStartTime,
            req.body.examEndTime,
            req.body.examDesc,
            req.body.examInstructions
        );
        newExam.studentsList = studentsList;
        const examJson = JSON.parse(JSON.stringify(newExam));
        const result = await firebase_firestore
            .collection("exams")
            .doc(req.body.examId)
            .update(examJson);
        // await firebase_firestore.collection('users').doc(req.user.userId).set({examsCreated:presentExamsCreated},{merge:true})
        // await firebase_firestore.collection('users').doc(req.user.userId).update({ examsCreated: fieldValue.arrayUnion(newId) });
        return res.status(200).json("Exam details updated successfully!");
    } catch (error) {
        return res.status(500).json("Failed to update exam " + error);
    }
};

const getExam = async (req, res) => {
    try {
        if (req.query.examId) {
            const exam = await firebase_firestore
                .collection("exams")
                .doc(req.query.examId)
                .get();
            if (exam) {
                if (!examAccess(exam, req.user.userId)) {
                    return res
                        .status(400)
                        .json("Permission denied to access the exam");
                }
                let { supervisorId, studentsList, createdAt, ...other } =
                    exam.data();

                return res.status(200).json(other);
            } else {
                return res.status(400).json("Invalid examId");
            }
        } else {
            res.status(400).json("Provide examId");
        }
    } catch (error) {
        return res.status(500).json(error + " Failed to get exam details");
    }
};

const deleteExam = async (req, res) => {
    try {
        if (req.body.examId) {
            const exam = await firebase_firestore
                .collection("exams")
                .doc(req.body.examId)
                .get();
            const examSup = exam.data()["supervisorId"];
            const studentsList = exam.data()["studentsList"];
            try {
                await firebase_firestore
                    .collection("questionPapers")
                    .doc(exam.data()["questionPaperId"])
                    .delete();
                p;
            } catch (error) {
                console.log("Question Paper was not created");
            }
            await firebase_firestore
                .collection("users")
                .doc(examSup)
                .update({
                    examsCreated: admin.firestore.FieldValue.arrayRemove(
                        exam.data()["examId"]
                    ),
                });
            studentsList.map(async (student) => {
                await firebase_firestore
                    .collection("users")
                    .doc(student)
                    .update({
                        examsEnrolled: admin.firestore.FieldValue.arrayRemove(
                            exam.data()["examId"]
                        ),
                    });
            });
            await firebase_firestore.collection("exams").doc(exam.id).delete();

            return res.status(200).json("Exam deleted successfully!");
        } else {
            return res.status(400).json("Provide examId");
        }
    } catch (error) {
        return res.status(500).json(error + " Failed to delete exam");
    }
};

const getAllExams = async (req, res) => {
    if (req.query.examId) {
        getExam(req, res);
    } else {
        if (req.user.isStudent) {
            const studentId = req.user.userId;

            try {
                var examsList = [];
                var examIdsList;
                try {
                    examIdsList = await (
                        await firebase_firestore
                            .collection("users")
                            .doc(studentId)
                            .get()
                    ).data()["examsEnrolled"];
                } catch (error) {
                    return res.status.json([]);
                }
                if (examIdsList) {
                    for (var i = 0; i < examIdsList.length; i++) {
                        var exam = await firebase_firestore
                            .collection("exams")
                            .doc(examIdsList[i])
                            .get();
                        let examData = exam.data();
                        if (examData) {
                            let examData = exam.data();
                            let {
                                supervisorId,
                                studentsList,
                                questionPaperId,
                                createdAt,
                                examInstructions,
                                ...other
                            } = examData;

                            examsList.push(other);
                        }
                    }
                } else {
                    return res.status(200).json([]);
                }

                if (examsList.length > 0) {
                    return res.status(200).json(examsList);
                } else {
                    return res.status(200).json([]);
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json("Something went wrong");
            }
        } else if (req.user.isSupervisor) {
            // exam_name,exam_createdat, desc, startat,endat

            const supervisorId = req.user.userId;

            try {
                var examsList = [];
                var examIdsList;
                try {
                    examIdsList = await (
                        await firebase_firestore
                            .collection("users")
                            .doc(supervisorId)
                            .get()
                    ).data()["examsCreated"];
                } catch (error) {
                    return res.status(200).json([]);
                }
                if (examIdsList) {
                    for (var i = 0; i < examIdsList.length; i++) {
                        var exam = await firebase_firestore
                            .collection("exams")
                            .doc(examIdsList[i])
                            .get();
                        if (exam) {
                            let examData = exam.data();
                            examsList.push({
                                examId: examData.examId,
                                examName: examData.examName,
                                examCreatedAt: examData.createdAt,
                                examDesc: examData.examDesc,
                                examStartTime: examData.examStartTime,
                                examEndTime: examData.examEndTime,
                            });
                        }
                    }
                } else {
                    return res.status(200).json([]);
                }
                if (examsList.length > 0) {
                    // sort examList based on date
                    examsList.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    return res.status(200).json(examsList);
                } else {
                    return res.status(200).json([]);
                }
            } catch (error) {
                return res.status(500).json("Something went wrong");
            }
        }
    }
};

// CRUD QUESTION PAPER
const assignQuestionPaper = async (req, res) => {
    try {
        if (!req.body.examId) {
            return res.status(400).json("Provide examId in request body");
        }
        const qpe = await questionPaperFromExam(req.body.examId);

        if (qpe) {
            return res
                .status(400)
                .json("Question Paper already exists for the exam ");
        }
        var maxMarks = 0;
        for (var i = 0; i < req.body.questionAnswers.length; i++) {
            maxMarks += req.body.questionAnswers[i].weightage;
        }
        const questionPaper = new QuestionPaper(
            req.body.examId,
            req.body.questionAnswers,
            maxMarks
        );

        const questionPaperJson = JSON.parse(JSON.stringify(questionPaper));
        const newId = uid();

        const result1 = await firebase_firestore
            .collection("questionPapers")
            .doc(newId)
            .create(questionPaperJson);
        const result2 = await firebase_firestore
            .collection("exams")
            .doc(req.body.examId)
            .update({
                questionPaperId: newId,
            });
        return res
            .status(200)
            .json("Question Paper created successfull" + result1 + result2);
    } catch (error) {
        return res.status(400).json("Failed to create questionPaper" + error);
    }
};

const updateQuestionPaper = async (req, res) => {
    try {
        if (req.body.questionPaperId && req.body.examId) {
            var maxMarks = 0;
            for (var i = 0; i < req.body.questionAnswers.length; i++) {
                maxMarks += req.body.questionAnswers[i].weightage;
            }
            const questionPaper = new QuestionPaper(
                req.body.examId,
                req.body.questionAnswers,
                maxMarks
            );
            const questionPaperJson = JSON.parse(JSON.stringify(questionPaper));
            if (
                questionPaperExists(req.body.questionPaperId, req.body.examId)
            ) {
                const result1 = await firebase_firestore
                    .collection("questionPapers")
                    .doc(req.body.questionPaperId)
                    .update(questionPaperJson);
                // const result2 = await firebase_firestore.collection("exams").doc(req.body.examId).update({questionPaperId:req.questionPaperId})
                return res
                    .status(200)
                    .json("Question Paper updated successfully" + result1);
            } else {
                return res
                    .status(400)
                    .json(
                        "The question paper you are trying to edit doesn't exists"
                    );
            }
        } else {
            return res
                .status(400)
                .json("Provide questionPaper and examId properly");
        }
    } catch (error) {
        return res.status(500).json("Failed to update Question Paper" + error);
    }
};

const deleteQuestionPaper = async (req, res) => {
    if (req.body.questionPaperId && req.body.examId) {
        if (questionPaperExists(req.body.questionPaperId, req.body.examId)) {
            await firebase_firestore
                .collection("questionPapers")
                .doc(req.body.questionPaperId)
                .delete();
            await firebase_firestore
                .collection("exams")
                .doc(req.body.examId)
                .update({
                    questionPaperId: fieldValue.delete(),
                });
            return res.status(200).json("Question Paper deleted");
        }
    } else {
        return res.status(400).json("Provide proper exam and question Paper");
    }
};

const enrollStudent = async (req, res) => {
    try {
        const studentsList = req.body.studentsList;
        var filteredStudentsList = [];
        var invalidUsers = [];
        for (var i = 0; i < studentsList.length; i++) {
            req.body.emailId = studentsList[i];
            await userExists(req, res, async () => {
                if (req.body.userExists) {
                    filteredStudentsList.push(req.body.userExists);
                    try {
                        await Promise.resolve(
                            firebase_firestore
                                .collection("users")
                                .doc(req.body.userExists.userId)
                                .update({
                                    examsEnrolled:
                                        admin.firestore.FieldValue.arrayUnion(
                                            req.body.examId
                                        ),
                                })
                        );
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    invalidUsers.push(req.body.emailId);
                }
            });
        }
        for (var i = 0; i < filteredStudentsList.length; i++) {
            try {
                await firebase_firestore
                    .collection("exams")
                    .doc(req.body.examId)
                    .update({
                        studentsList: admin.firestore.FieldValue.arrayUnion(
                            filteredStudentsList[i].userId
                        ),
                    });
                // Create a URL for that particular student for that exam and mail it
                const student_data = await firebase_firestore
                    .collection("users")
                    .where("emailId", "==", filteredStudentsList[i].emailId)
                    .get();
                const Exam_Id = await firebase_firestore
                    .collection("exams")
                    .where("examId", "==", req.body.examId)
                    .get();

                var student_details;
                var Test_name;
                if (!student_data.empty && !Exam_Id.empty) {
                    student_data.forEach((doc) => {
                        console.log(doc.id, "=>", doc.data());
                        student_details = doc.data();
                    });
                    Exam_Id.forEach((doc) => {
                        console.log(doc.id, "=>", doc.data());
                        Test_name = doc.data();
                    });
                }

                const subject = "Exam Enrollment";
                const body =
                    "<h1>Exam Enrollement Details<h1><p>You have been enrolled in " +
                    Test_name.examName +
                    " " +
                    "Exam</p>" +
                    "<br>Check your dashboard for more details</br>";
                await sendMail(filteredStudentsList[i].emailId, subject, body);
            } catch (error) {
                console.log(error);
            }
        }

        return res.status(200).json(
            // "Students enrolled successfully and users:- " +
            invalidUsers
            // +
            // " doesn't exists"
        );
    } catch (error) {
        res.status(500).json("Something went wrong try again later" + error);
    }
};

const removeStudents = async (req, res) => {
    try {
        const studentsList = req.body.studentsList;
        var filteredStudentsList = [];
        var invalidUsers = [];
        for (var i = 0; i < studentsList.length; i++) {
            req.body.emailId = studentsList[i];
            await userExists(req, res, async () => {
                if (req.body.userExists) {
                    filteredStudentsList.push(req.body.userExists);
                    try {
                        await Promise.resolve(
                            firebase_firestore
                                .collection("users")
                                .doc(req.body.userExists.userId)
                                .update({
                                    examsEnrolled:
                                        admin.firestore.FieldValue.arrayRemove(
                                            req.body.examId
                                        ),
                                })
                        );
                    } catch (error) {}
                } else {
                    invalidUsers.push(req.body.emailId);
                }
            });
        }
        for (var i = 0; i < filteredStudentsList.length; i++) {
            try {
                await firebase_firestore
                    .collection("exams")
                    .doc(req.body.examId)
                    .update({
                        studentsList: admin.firestore.FieldValue.arrayRemove(
                            filteredStudentsList[i].userId
                        ),
                    });
            } catch (error) {}
        }

        return res.status(200).json(
            // "Students removed from exam successfully and users:- " +
            invalidUsers
            // +
            // " doesn't exists"
        );
    } catch (error) {
        res.status(500).json("Something went wrong try again later" + error);
    }
};

const getQuestionPaper = async (req, res) => {
    try {
        // does exam exists
        const exam = await firebase_firestore
            .collection("exams")
            .doc(req.query.examId)
            .get();

        if (!exam.exists) {
            return res.status(400).json("Exam doesn't exist");
        }
        // is user authentic to get questionPaper
        if (!examAccess(exam, req.user.userId)) {
            return res.status(400).json("Permission denied to access the exam");
        }
        if (!(await inTime(exam, req.user.userId, req))) {
            return res.status(400).json("Exam Time out");
        }

        var questionPaper = [];
        var questionPaperAnswers;
        try {
            questionPaperAnswers = (
                await firebase_firestore
                    .collection("questionPapers")
                    .doc(exam.data()["questionPaperId"])
                    .get()
            ).data()["questionAnswers"];
        } catch (error) {
            return res.status(400).json("Please create a question Paper first");
        }
        if (req.user.isSupervisor) {
            return res.status(200).json(questionPaperAnswers);
        }
        for (var i = 0; i < questionPaperAnswers.length; i++) {
            var question = {
                questionId: questionPaperAnswers[i]["questionId"],
                question: questionPaperAnswers[i]["question"],
                weightage: questionPaperAnswers[i]["weightage"],
            };
            var options = [];
            for (
                var j = 0;
                j < questionPaperAnswers[i]["options"].length;
                j++
            ) {
                var option = {
                    optionId: questionPaperAnswers[i]["options"][j]["optionId"],
                    optionDesc:
                        questionPaperAnswers[i]["options"][j]["optionDesc"],
                };
                options.push(option);
            }
            question.options = options;

            questionPaper.push(question);
        }
        if (req.user.isStudent) {
            let examSatrtTime = DateTime.local().toUTC().toString();

            await firebase_firestore
                .collection("exams")
                .doc(req.query.examId)
                .collection("candidates")
                .doc(req.user.userId)
                .update({ startedExamAt: examSatrtTime });
        }
        console.log("Question Paper fetched from " + req.user.userId);
        return res.status(200).json(questionPaper);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const receiveAnswers = async (req, res) => {
    try {
        const exam = await firebase_firestore
            .collection("exams")
            .doc(req.body.examId)
            .get();

        if (exam) {
            if (!examAccess(exam, req.user.userId)) {
                return res
                    .status(400)
                    .json("You are not allowed to access the exam");
            }
            // console.log(hasSubmitted(exam.data()["examId"],req.user.userId))
            if (await hasSubmitted(exam.data()["examId"], req.user.userId)) {
                return res
                    .status(400)
                    .json("You have already submitted the exam");
            }

            const questionPaperDoc = await firebase_firestore
                .collection("questionPapers")
                .doc(exam.data()["questionPaperId"])
                .get();
            const questionPaper = questionPaperDoc.data()["questionAnswers"];

            var totalMarks = 0;

            const answers = req.body.answers;

            try {
                for (var i = 0; i < answers.length; i++) {
                    var currentQuestionId = answers[i].questionId;
                    var currentUserSelection = answers[i].userSelection;

                    for (var j = 0; j < questionPaper.length; j++) {
                        if (questionPaper[j].questionId === currentQuestionId) {
                            if (
                                questionPaper[j].options[currentUserSelection]
                                    .isCorrect
                            ) {
                                totalMarks =
                                    totalMarks + questionPaper[j].weightage;
                            }
                        }
                    }
                }

                const answerJson = {
                    answers: req.body.answers,
                    marksScored: totalMarks,
                };
                //  const answerJson = JSON({answers,totalMarks})
                // req.body.answers.marksScored = totalMarks

                console.log(answerJson);
                try {
                    // const answerResponse = [req.user.userId,req.body.answers]

                    // await firebase_firestore
                    //     .collection("exams")
                    //     .doc(req.body.examId)
                    //     .collection("responses")
                    //     .doc(req.user.userId)
                    //     .set({
                    //         ...answerJson,
                    //     });
                    let endedExamAt = DateTime.local().toUTC().toString();
                    await firebase_firestore
                        .collection("exams")
                        .doc(req.body.examId)
                        .collection("candidates")
                        .doc(req.user.userId)
                        .update({
                            attempted: true,
                            response: req.body.answers,
                            score: totalMarks,
                            endedExamAt: endedExamAt,
                        });

                    // await firebase_firestore
                    //     .collection("users")
                    //     .doc(req.user.userId)
                    //     .update({
                    //         history: fieldValue.arrayUnion(req.body.examId),
                    //     });
                    // Send email to the student
                    const mailBody =
                        "<h1>Your Exam Results</h1>" +
                        "<p>Your marks for the exam " +
                        exam.data()["examName"] +
                        " is " +
                        totalMarks;
                    await sendMail(
                        req.user.emailId,
                        "Results for " + exam.data()["examName"],
                        mailBody
                    );

                    res.status(200).json("Response submitted successfully");
                } catch (error) {
                    res.status(500).json(
                        "Something went wrong. Try agin later."
                    );
                }
            } catch (error) {
                res.status(500).json("Something went wrong.");
            }
        }
    } catch (error) {
        res.status(500).json("Something went wrongg");
    }
};

const getCurrentExam = async (req, res) => {
    if (req.user.isStudent) {
        const studentId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(studentId)
                        .get()
                ).data()["examsEnrolled"];
            } catch (error) {
                return res.status().json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();

                    if (exam) {
                        // check if the student have already submitted the exam
                        const examSubmitted = await hasSubmitted(
                            exam.data()["examId"],
                            studentId
                        );
                        if (examSubmitted) {
                            continue;
                        }

                        inTime(exam, studentId, req);
                        if (req.timeStatus === "inTime") {
                            let examData = exam.data();
                            if (examData) {
                                let examData = exam.data();
                                let {
                                    supervisorId,
                                    studentsList,
                                    questionPaperId,
                                    createdAt,
                                    examInstructions,
                                    ...other
                                } = examData;

                                examsList.push(other);
                            }
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Something went wrong");
        }
    } else if (req.user.isSupervisor) {
        const supervisorId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(supervisorId)
                        .get()
                ).data()["examsCreated"];
            } catch (error) {
                return res.status(200).json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();
                    if (exam) {
                        inTime(exam, studentId, req);
                        if (req.timeStatus === "inTime") {
                            let examData = exam.data();
                            // let {studentsList,...other} = examData;

                            examsList.push(examData);
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            return res.status(500).json("Something went wrong");
        }
    }
};

const getExamHistory = async (req, res) => {
    if (req.user.isStudent) {
        const studentId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(studentId)
                        .get()
                ).data()["examsEnrolled"];
            } catch (error) {
                return res.status.json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();
                    if (exam) {
                        const examSubmitted = await hasSubmitted(
                            exam.data()["examId"],
                            studentId
                        );
                        inTime(exam, studentId, req);
                        if (
                            req.timeStatus === "afterTime" ||
                            examSubmitted === true
                        ) {
                            let examData = exam.data();
                            if (examData) {
                                let examData = exam.data();
                                let {
                                    supervisorId,
                                    studentsList,
                                    questionPaperId,
                                    createdAt,
                                    examInstructions,
                                    ...other
                                } = examData;

                                examsList.push(other);
                            }
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Something went wrong");
        }
    } else if (req.user.isSupervisor) {
        const supervisorId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(supervisorId)
                        .get()
                ).data()["examsCreated"];
            } catch (error) {
                return res.status(200).json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();
                    if (exam) {
                        inTime(exam, studentId, req);
                        if (req.timeStatus === "afterTime") {
                            let examData = exam.data();
                            // let {studentsList,...other} = examData;

                            examsList.push(examData);
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            return res.status(500).json("Something went wrong");
        }
    }
};

const getUpcomingExams = async (req, res) => {
    if (req.user.isStudent) {
        const studentId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(studentId)
                        .get()
                ).data()["examsEnrolled"];
            } catch (error) {
                return res.status.json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();
                    if (exam) {
                        inTime(exam, studentId, req);
                        if (req.timeStatus === "beforeTime") {
                            let examData = exam.data();
                            if (examData) {
                                let examData = exam.data();
                                let {
                                    supervisorId,
                                    studentsList,
                                    questionPaperId,
                                    createdAt,
                                    examInstructions,
                                    ...other
                                } = examData;

                                examsList.push(other);
                            }
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Something went wrong");
        }
    } else if (req.user.isSupervisor) {
        const supervisorId = req.user.userId;

        try {
            var examsList = [];
            var examIdsList;
            try {
                examIdsList = await (
                    await firebase_firestore
                        .collection("users")
                        .doc(supervisorId)
                        .get()
                ).data()["examsCreated"];
            } catch (error) {
                return res.status(200).json([]);
            }
            if (examIdsList) {
                for (var i = 0; i < examIdsList.length; i++) {
                    var exam = await firebase_firestore
                        .collection("exams")
                        .doc(examIdsList[i])
                        .get();
                    if (exam) {
                        inTime(exam, studentId, req);
                        if (req.timeStatus === "beforeTime") {
                            let examData = exam.data();
                            // let {studentsList,...other} = examData;

                            examsList.push(examData);
                        }
                    }
                }
            } else {
                return res.status(200).json([]);
            }

            if (examsList.length > 0) {
                return res.status(200).json(examsList);
            } else {
                return res.status(200).json([]);
            }
        } catch (error) {
            return res.status(500).json("Something went wrong");
        }
    }
};

const getExamStudents = async (req, res) => {
    const examId = req.query.examId;
    try {
        // const studentIdsList = await firebase_firestore.collection("exams").doc(examId).get().data()["studentsList"];
        const studentIdsList = await (
            await firebase_firestore.collection("exams").doc(examId).get()
        ).data()["studentsList"];

        if (studentIdsList) {
            var studentsList = [];
            for (var i = 0; i < studentIdsList.length; i++) {
                var student = await firebase_firestore
                    .collection("users")
                    .doc(studentIdsList[i])
                    .get();
                if (student) {
                    let studentData = student.data();
                    let filterStudentData = {
                        studentId: studentData.userId,
                        studentFirstName: studentData.firstName,
                        studentLastName: studentData.lastName,

                        studentEmailId: studentData.emailId,
                        studentPhoneNumber: studentData.phoneNumber,
                    };
                    studentsList.push(filterStudentData);
                }
            }
            return res.status(200).json(studentsList);
        }
    } catch (error) {
        return res.status(500).json("Something went wrong");
    }
};

const getExamResponses = async (req, res) => {
    const examId = req.query.examId;
    try {
        const questionPaperId = await (
            await firebase_firestore.collection("exams").doc(examId).get()
        ).data()["questionPaperId"];
        const questionPaper = await firebase_firestore
            .collection("questionPapers")
            .doc(questionPaperId)
            .get();
        console.log(questionPaper.data());

        var details = {};
        // details.questionPaper = questionPaper.data();
        details.totalMarks = questionPaper.data().maxMarks;
        const studentIdsList = await (
            await firebase_firestore.collection("exams").doc(examId).get()
        ).data()["studentsList"];
        if (studentIdsList) {
            var studentsList = [];

            for (var i = 0; i < studentIdsList.length; i++) {
                var student = await firebase_firestore
                    .collection("exams")
                    .doc(examId)
                    .collection("candidates")
                    .doc(studentIdsList[i])
                    .get();
                if (student.data()) {
                    let studentData = student.data();
                    let studentInfo = await firebase_firestore
                        .collection("users")
                        .doc(studentIdsList[i])
                        .get();
                    if (studentInfo.data()) {
                        let filterStudentData = {
                            studentId: studentIdsList[i],
                            studentFirstName: studentInfo.data().firstName,
                            studentLastName: studentInfo.data().lastName,
                            // studentResponse: studentData.response ?? [],
                            studentMarksScored: studentData.score ?? 0,
                        };
                        studentsList.push(filterStudentData);
                    }
                } else {
                    // let filterStudentData = {
                    //     studentId: studentIdsList[i],
                    //     studentResponse: [],
                    //     studentMarksScored: 0,
                    // }
                    // studentsList.push(filterStudentData);
                }
            }
            details.studentsList = studentsList;
            return res.status(200).json(details);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getIndividualExamResponse = async (req, res) => {
    try {
        const studentInfo = await firebase_firestore
            .collection("users")
            .doc(req.query.studentId)
            .get();
        const studentExamInfo = await firebase_firestore
            .collection("exams")
            .doc(req.query.examId)
            .collection("candidates")
            .doc(req.query.studentId)
            .get();
        // const questionPaperId = await (await firebase_firestore.collection("exams").doc(req.query.examId).get()).data()["questionPaperId"];
        // const questionPaper = await firebase_firestore.collection("questionPapers").doc(questionPaperId).get();
        if (studentInfo.data() && studentExamInfo.data()) {
            let returnJson = {};
            returnJson.studentImageURL = studentExamInfo.data().face ?? "";
            returnJson.studentFirstName = studentInfo.data().firstName;
            returnJson.studentLastName = studentInfo.data().lastName;
            returnJson.studentEmailId = studentInfo.data().emailId;
            returnJson.studentPhoneNumber = studentInfo.data().phoneNumber;
            returnJson.studentId = studentInfo.data().userId;
            returnJson.studentResult = await getStudentAnswerQuestionResponse(
                req,
                res,
                true
            );

            // returnJson.studentMarksScored = studentExamInfo.data().score ?? 0;
            // returnJson.studentResponse = studentExamInfo.data().response ?? [];
            let events = [];

            let collections = await firebase_firestore
                .collection("exams")
                .doc(req.query.examId)
                .collection("candidates")
                .doc(req.query.studentId)
                .listCollections();
            for (let i = 0; i < collections.length; i++) {
                let documents = await collections[i].listDocuments();
                let eventCount = 0;
                for (let j = 0; j < documents.length; j++) {
                    eventCount++;
                }
                let event = {
                    eventName: collections[i].id,
                    eventCount: eventCount,
                };
                events.push(event);
            }
            console.log(events);
            returnJson.events = events;
            return res.status(200).json(returnJson);
        } else {
            return res.status(500).json("Improper details");
        }
    } catch (error) {
        console.log("error :-" + error);
        return res.status(500).json(error);
    }
};

const getMalpracticeTypeImagesOfStudent = async (req, res) => {
    try {
        const studentId = req.query.studentId;
        const examId = req.query.examId;
        const malpracticeType = req.query.malpracticeType;
        if (studentId && examId && malpracticeType) {
            try {
                const malpracticeCollection = await firebase_firestore
                    .collection("exams")
                    .doc(examId)
                    .collection("candidates")
                    .doc(studentId)
                    .listCollections();
                let returnList = [];
                for (let i = 0; i < malpracticeCollection.length; i++) {
                    if (malpracticeCollection[i].id == malpracticeType) {
                        let documents = await malpracticeCollection[
                            i
                        ].listDocuments();
                        for (let j = 0; j < documents.length; j++) {
                            let malpracticeDetail = {};
                            let document = await documents[j].get();
                            console.log(document.data());

                            malpracticeDetail.imageURL =
                                document.data().imageUrl ?? "";
                            malpracticeDetail.time = document.data().time;
                            returnList.push(malpracticeDetail);
                        }
                    }
                }
                return res.status(200).json(returnList);
            } catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        } else {
            return res.status(500).json("Invalid Request");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getStudentAnswerQuestionResponse = async (
    req,
    res,
    supervisorMode = false
) => {
    try {
        let studentId;
        console.log("--------- 1");
        if (supervisorMode) {
            studentId = req.query.studentId;
        }
        let exam;
        console.log("--------- 2");
        try {
            exam = await firebase_firestore
                .collection("exams")
                .doc(req.query.examId)
                .get();
            console.log("--------- 3");
        } catch (e) {
            return res.status(400).json("Exam doesn't exist");
        }
        if (exam.data()) {
            const questionPaperId = exam.data().questionPaperId;
            console.log("--------- 4");
            if (questionPaperId) {
                if (examAccess(exam, req.user.userId)) {
                    const questionPaper = await firebase_firestore
                        .collection("questionPapers")
                        .doc(questionPaperId)
                        .get();
                    console.log("--------- 5");
                    if (questionPaper.data()) {
                        const maxMarks = questionPaper.data().maxMarks;
                        const questionAnswers =
                            questionPaper.data().questionAnswers;
                        console.log("--------- 6");
                        try {
                            let studentExam;
                            console.log("--------- 7");
                            if (supervisorMode) {
                                console.log("student id is " + studentId);
                                try {
                                    studentExam = await firebase_firestore
                                        .collection("exams")
                                        .doc(req.query.examId)
                                        .collection("candidates")
                                        .doc(studentId)
                                        .get();
                                } catch (e) {
                                    console.log(e);
                                    return res
                                        .status(400)
                                        .json("Student doesn't exist");
                                }
                            } else {
                                console.log("--------- 8-2");
                                studentExam = await firebase_firestore
                                    .collection("exams")
                                    .doc(req.query.examId)
                                    .collection("candidates")
                                    .doc(req.user.userId)
                                    .get();
                                console.log("--------- 8-3");
                            }
                            console.log("--------- 9");
                            if (studentExam) {
                                if (studentExam.data()["attempted"] === true) {
                                    console.log("--------- 10");
                                    const studentResponse =
                                        studentExam.data()["response"];
                                    if (studentResponse) {
                                        console.log("--------- 11");
                                        let finalResult = {};

                                        finalResult.maxMarks = maxMarks;
                                        finalResult.marksScored =
                                            studentExam.data().score;
                                        let result = [];
                                        for (
                                            let i = 0;
                                            i < questionAnswers.length;
                                            i++
                                        ) {
                                            let currentQuestion = {};
                                            let currQuestionId =
                                                questionAnswers[i].questionId;
                                            let questionWeightage =
                                                questionAnswers[i].weightage;
                                            let question =
                                                questionAnswers[i].question;
                                            let correctOptionIds = [];
                                            let options = [];
                                            currentQuestion.questionId =
                                                currQuestionId;
                                            currentQuestion.weightage =
                                                questionWeightage;
                                            currentQuestion.question = question;

                                            for (
                                                let j = 0;
                                                j <
                                                questionAnswers[i].options
                                                    .length;
                                                j++
                                            ) {
                                                let currentOption_ = {};
                                                currentOption_.optionId =
                                                    questionAnswers[i].options[
                                                        j
                                                    ].optionId;
                                                currentOption_.optionDesc =
                                                    questionAnswers[i].options[
                                                        j
                                                    ].optionDesc;
                                                currentOption_.isCorrect =
                                                    questionAnswers[i].options[
                                                        j
                                                    ].isCorrect;
                                                for (
                                                    let k = 0;
                                                    k < studentResponse.length;
                                                    k++
                                                ) {
                                                    let currQuestionId_ =
                                                        studentResponse[k]
                                                            .questionId;
                                                    if (
                                                        currQuestionId ===
                                                        currQuestionId_
                                                    ) {
                                                        let selected =
                                                            studentResponse[k]
                                                                .userSelection;
                                                        if (
                                                            selected ===
                                                            currentOption_.optionId
                                                        ) {
                                                            currentOption_.isSelected = true;
                                                        } else {
                                                            currentOption_.isSelected = false;
                                                        }
                                                        options.push(
                                                            currentOption_
                                                        );
                                                    }
                                                }

                                                currentQuestion.options =
                                                    options;
                                            }

                                            result.push(currentQuestion);
                                        }

                                        finalResult.result = result;

                                        if (supervisorMode) {
                                            return finalResult;
                                        } else {
                                            return res
                                                .status(200)
                                                .json(finalResult);
                                        }
                                    } else {
                                        return res
                                            .status(400)
                                            .json(
                                                "Failed to retrieve student response"
                                            );
                                    }
                                } else {
                                    return res.status(200).json({});
                                }
                            } else {
                                return res
                                    .status(400)
                                    .json("Student exam not found");
                            }
                        } catch (error) {
                            res.status.json(
                                "Problem fetching student exam's details"
                            );
                        }
                    } else {
                        return res
                            .status(400)
                            .json("Question Paper doesn't exists");
                    }
                }
            } else {
                return res.status(400).json("Question paper ID not found");
            }
        } else {
            return res.status(400).json("Exam doesn't exists");
        }
    } catch (e) {
        return res.status(500).json("Something went wrong");
    }
};

export {
    createExam,
    updateExam,
    getExam,
    deleteExam,
    enrollStudent,
    assignQuestionPaper,
    updateQuestionPaper,
    getQuestionPaper,
    deleteQuestionPaper,
    removeStudents,
    getAllExams,
    receiveAnswers,
    getCurrentExam,
    getExamHistory,
    getUpcomingExams,
    getExamStudents,
    getExamResponses,
    getIndividualExamResponse,
    getMalpracticeTypeImagesOfStudent,
    getStudentAnswerQuestionResponse,
};

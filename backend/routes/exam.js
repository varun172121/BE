import { Router } from "express";
import { userExists } from "../helpers/users.js";
import * as auth from "../helpers/auth.js"
import * as exam from "../helpers/exams.js"
import {
  assignQuestionPaper,
  createExam,
  enrollStudent,
  getQuestionPaper,
  updateQuestionPaper,
  updateExam,
  getExam,
  deleteExam,
  deleteQuestionPaper,
  removeStudents,

  getAllExams,
  receiveAnswers,
  getCurrentExam,
  getUpcomingExams,
  getExamHistory,
  getExamStudents,
  getExamResponses,
  getIndividualExamResponse,
  getMalpracticeTypeImagesOfStudent,
  getStudentAnswerQuestionResponse,

} from "../controllers/exam.js";
import * as verifyRequests from "../helpers/verifyRequests.js"
const router = Router();



// CRUD EXAM
router.post("/", [auth.Token,auth.Supervisor], createExam);
router.put("/", [auth.Token,auth.Supervisor,exam.examCreatedBySupervisor], updateExam);
// router.get("/:examId", [auth.Token], getExam);
router.get("/", [auth.Token], getAllExams);
router.get("/current", [auth.Token], getCurrentExam);
router.get("/upcoming", [auth.Token], getUpcomingExams);
router.get("/history", [auth.Token], getExamHistory);


router.delete("/", [auth.Token,auth.ExamAndSupervisor], deleteExam);
router.post("/students", [auth.Token,auth.Supervisor,auth.ExamAndSupervisor,exam.examCreatedBySupervisor], enrollStudent);
router.delete("/students", [auth.Token,auth.Supervisor,auth.ExamAndSupervisor,exam.examCreatedBySupervisor], removeStudents);
router.get("/responses", [auth.Token,auth.Supervisor,auth.ExamAndSupervisorGetRequest],getExamResponses);
router.get("/student", [auth.Token,auth.Supervisor,auth.ExamAndSupervisorGetRequest],getIndividualExamResponse)
router.get("/malpractice", [auth.Token,auth.Supervisor,auth.ExamAndSupervisorGetRequest],getMalpracticeTypeImagesOfStudent);
router.get("/exam-response", [auth.Token],getStudentAnswerQuestionResponse);
// CRUD QUESTION PAPER
router.post("/question-paper", [auth.Token,auth.Supervisor,auth.ExamAndSupervisor], assignQuestionPaper);
router.get("/question-paper",[auth.Token],getQuestionPaper);
router.put("/question-paper", [auth.Token,auth.Supervisor,auth.ExamAndSupervisor], updateQuestionPaper);
router.delete("/question-paper", [auth.Token,auth.Supervisor,auth.ExamAndSupervisor], deleteQuestionPaper);
router.post("/submit-answer", [auth.Token], receiveAnswers);
router.get("/students", [auth.Token,auth.Supervisor,auth.ExamAndSupervisorGetRequest],getExamStudents)
export const routes = router;

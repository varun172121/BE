import e from "express";
import jwt from "jsonwebtoken"

import * as config from "../config.js";
import {
    firebase_firestore
} from "../db.js";
import { DateTime } from "luxon";


export const questionPaperExists = async (questionPaperId, examId) => {

    try {
        await firebase_firestore.collection("exams").doc(examId).get("questionPaperId").then((snapshot) => {
            if (snapshot.exists) {
                if (snapshot.data()["questionPaperId"] === questionPaperId) {

                    return true
                } else {
                    return false
                }
            } else {
                return false
            }

        })
    } catch (error) {
        return false
    }

}
export const examCreatedBySupervisor = async (req, res, next) => {
    const userId = req.user.userId;
    const examId = req.body.examId;
    var examFound = false;
    if(examId){
        var examsCreated
        try {
            examsCreated = (await firebase_firestore.collection("users").doc(userId).get()).data()["examsCreated"]
    
        } catch (error) {
            return res.status(400).json("User doesn't have any exams created")
        }
     
        if (examsCreated) {
            for (var i = 0; i < examsCreated.length; i++) {
                if (examsCreated[i] === examId) {
                    // req.examCreatedBySupervisor = true;
                    examFound = true;
                    break;
                  
                }
            }
        }
        if(examFound){
            next()
        }else{

            return res.status(400).json("You are not authenticated for changing this exam settings");
        }
    }else{
        return res.status(400).json("provide examId")
    }


}


export const examAccess = (exam,userId)=>{
    var userEligible = false
    const usersList = exam.data()["studentsList"]
    usersList.push(exam.data()["supervisorId"])


    for (var i = 0; i < usersList.length; i++) {
        if (usersList[i] === userId) {
            userEligible = true
            break;
        }
    }
    console.log("in user eligible")
    return userEligible
}

export const inTime = async(exam,userId,req)=>{
    console.log("Time print"+ new Date());
    // const startTime = new Date(exam.data()["examStartTime"]).toISOString()
    // const endTime = new Date(exam.data()["examEndTime"]).toISOString()

    const startTime = DateTime.fromISO(exam.data()["examStartTime"])
    const endTime = DateTime.fromISO(exam.data()["examEndTime"])
    const supervisorId = exam.data()["supervisorId"]


    var allow = false
    if(userId === supervisorId){
        allow = true
    }else{
        // const currTime = new Date().toISOString()
        const currTime = DateTime.local()


        if(currTime>=startTime && currTime<=endTime){
            allow = true
            req.timeStatus = "inTime"
        }else{
            if(currTime<startTime && currTime<endTime){
                req.timeStatus = "beforeTime"
            }else if(currTime>endTime && currTime>startTime){
                req.timeStatus = "afterTime"
            }
            allow = false
        }
    }
    console.log(req.timeStatus);
    console.log("inTime "+ allow)
    return allow


}

export const questionPaperFromExam = async(examId)=>{
    try {
        const questionPaperId = await (await firebase_firestore.collection("exams").doc(examId).get()).data()["questionPaperId"]

        if(questionPaperId){
            console.log(questionPaperId)
            return true
        }else{
            return false
        }



    } catch (error) {

         return false
    }
}

export const hasSubmitted = async(examId,userId)=>{

    try {

        const submittedList = await (await firebase_firestore.collection("exams").doc(examId).collection("candidates").doc(userId).get()).data()["attempted"];
        
        if(submittedList){
            console.log("Exam already submitted");
            // for(var i=0;i<submittedList.length;i++){
            //     if(submittedList[i]===examId){
            //         return true
            //     }
            // }  
            return true;          
        }
        console.log("not submitted allow it")
        return false

    } catch (error) {
        console.log("error but not submitted");
        return false
    }
}


export const calculateMarks = async ()=>{

}

export const isStudentEnrolled = async (req, res, next) => {


}
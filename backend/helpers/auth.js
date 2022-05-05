import jwt from "jsonwebtoken"
import * as config from "../config.js";
import {
    firebase_firestore
} from "../db.js";
import CryptoJs from "crypto-js";


export const userExistsMiddleWare = async (req, res, next) => {
    try {

        const snapshot = await firebase_firestore.collection("users").where("emailId", "==", req.user.emailId).get();
        var userExists = false
        if (snapshot.empty) {
            userExists = false
        }
        else {
            snapshot.forEach((doc) => {

                if (doc.data().emailVerified) {
                    userExists = doc.data()
                }

            })
        }
        req.body.userExists = userExists

        next()



    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

}
export const SessionId = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        return res.status(401).json("Login first")
    }
}
export const Token = (req, res, next) => {

    const authHeader = req.headers.token
    console.log(authHeader)
    if (authHeader) {

        // decrypt the token
        // const authHeaderDecrypt = CryptoJs.AES.decrypt(authHeader, config.token_encrypt_key);
        // console.log(authHeaderDecrypt)
        // const authHeaderDecryptString = authHeaderDecrypt.toString(CryptoJs.enc.Utf8);
        // console.log(authHeaderDecryptString)
        jwt.verify(authHeader, config.jwt_passKey, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(403).json("invalid token")
            }
            req.user = user
    
            next()
        })
    } else {
        return res.status(412).json("No token provided")

    }
}



export const emailToken = (token, req, res) => {

    const authHeader = token
    if (authHeader) {

        // decrypt the token
        // const authHeaderDecrypt = CryptoJs.AES.decrypt(authHeader, config.token_encrypt_key);
        // console.log(authHeaderDecrypt)
        // const authHeaderDecryptString = authHeaderDecrypt.toString(CryptoJs.enc.Utf8);
        // console.log(authHeaderDecryptString)
        jwt.verify(authHeader, config.jwt_passKey, (err, user) => {
            if (err) {
                req.email = false
                // res.write("Link has Expired")
                // res.end()
                // return
                return res.status(403).json("Link has Expired")
            }
            req.email = true
            req.user = user

        })
    } else {
        req.email = false
        // res.write("Invalid Link")
        return res.status(412).json("Invalid Link")

    }
}



export const matchTokenAndSSession = (req, res, next) => {
    if (req.session.userId === req.user.userId) {


        next()
    } else {
        delete req.user

        return res.status(403).json("you are not authenticated")
    }
}

export const UserInParams = (req, res, next) => {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json("You are not allowed to do that")
    }

}

export const Supervisor = (req, res, next) => {


    if (req.user.isSupervisor || req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json("You are not allowed to do that")
    }

}

export const Student = (req, res, next) => {

    if (req.user.isStudent || req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json("You are not allowed to do that")
    }

}

export const Admin = (req, res, next) => {

    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json("You are not alowed to do that!");
    }

};


export const ExamAndSupervisor = async (req, res, next) => {
    try {
        const examsCreatedList = (await firebase_firestore.collection("users").doc(req.user.userId).get()).data()["examsCreated"]
        if (!examsCreatedList) {
            return res.status(404).json("No exams created by the user")
        }
        req.examIdmatch = false

        for (var i = 0; i < examsCreatedList.length; i++) {


            if (examsCreatedList[i] === req.body.examId) {


                req.examIdmatch = true
                break;
            }
        }
        if (req.examIdmatch) {

            next()
        } else {

            return res.status(400).json("You are not authenticated to modify this exam")
        }

    } catch (error) {
        return res.status(500).json("Something went wrong while authenticating supervisor and exam")
    }

}


export const ExamAndSupervisorGetRequest = async (req, res, next) => {
    try {
        const examsCreatedList = (await firebase_firestore.collection("users").doc(req.user.userId).get()).data()["examsCreated"]
        if (!examsCreatedList) {
            return res.status(404).json("No exams created by the user")
        }
        req.examIdmatch = false

        for (var i = 0; i < examsCreatedList.length; i++) {


            if (examsCreatedList[i] === req.query.examId) {


                req.examIdmatch = true
                break;
            }
        }
        if (req.examIdmatch) {

            next()
        } else {

            return res.status(400).json("You are not authenticated to modify this exam")
        }

    } catch (error) {
        return res.status(500).json("Something went wrong while authenticating supervisor and exam")
    }

}









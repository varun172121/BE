import {
    firebase_firestore
} from "../db.js";

const userExists = async (req, res, next) => {
    try {

        const snapshot = await firebase_firestore.collection("users").where("emailId", "==", req.body.emailId).get();
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

const userExistsFunction = async (req,res,next) => {
    try {

        const snapshot = await firebase_firestore.collection("users").where("emailId", "==", req.body.emailId).get();
        var userExists = false
        if (snapshot.empty) {
            userExists = false
        }
        else {
            snapshot.forEach((doc) => {
                userExists = doc.data()
            })
        }
        req.body.userExists = userExists

        next()



    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}





export {
    userExists,
    userExistsFunction
}
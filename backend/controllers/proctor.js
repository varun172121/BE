import { storageRef, firebase_firestore } from "../db.js";
import { uid } from "../helpers/other.js";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { DateTime } from "luxon";



const upload_face = async (req, res) => {

    const metadata = { contentType: "image/jpeg; charset=utf-8" };
    const folder =
        req.user.userId +
        req.body.examId +
        "/" +
        "FACE_RECOGNITION" +
        "/" +
        "face.jpeg";
    const storageRef_1 = ref(storageRef, folder);
    await upload().then(async()=>{
         await download_link()
    });


    async function upload() {

        try{

            await uploadString(storageRef_1, req.body.image, "data_url", metadata).then(
                (snapshot) => {
                    console.log("Uploaded a base64 string!", snapshot);
                }
                );
            }catch(err){
                console.log("Error uploading image :- "+err)
            }
    }
    async function updating_into_firestore(url) {
        await firebase_firestore.collection("exams").doc(req.body.examId).collection("candidates").doc(req.user.userId).set({ "face": url, folderLocation: folder })
        return res.status(200).json({ "userImageLink": url })

    }
    async function download_link(){
        try {
            await getDownloadURL(ref(storageRef_1))
            .then(async(url) => {

                console.log("download url", url);
              await updating_into_firestore(url);
            })
            .catch((error) => {
                console.log("errr", error);
            });           
        } catch (error) {
            console.log("Failed to get download Link:- " +error);
        }
    }
};
const malpractices = async (req, res) => {
    const newId = uid();

    const metadata = { contentType: "image/jpeg; charset=utf-8" };
    const folder =
        req.user.userId +
        req.body.examId +
        "/" +
        req.body.malpracticeType +
        "/" +
        newId +
        ".jpeg";
    const storageRef_1 = ref(storageRef, folder);
    if (req.body.malpracticeType === "SCREEN_CHANGED" || req.body.malpracticeType === "FULL_SCREEN_EXIT") {
        const curr_time = DateTime.local().toUTC().toString();
        await firebase_firestore
            .collection("exams")
            .doc(req.body.examId)
            .collection("candidates")
            .doc(req.user.userId)
            .collection(req.body.malpracticeType)
            .add({ time: curr_time });
        return res.status(200).json("Log entered successfully");
    }
    await upload().then(async()=>{
        await download_link()
    });
    res.status(200).json("file is uploaded successfully");
    res.end();
    async function upload() {
        await uploadString(storageRef_1, req.body.image, "data_url", metadata).then(
            (snapshot) => {
                console.log("Uploaded a base64 string!", snapshot);
            }    
        );
    }
    async function updating_into_firestore(url) {
        const curr_time = DateTime.local().toUTC().toString();
        
        await firebase_firestore
            .collection("exams")
            .doc(req.body.examId)
            .collection("candidates")
            .doc(req.user.userId)
            .collection(req.body.malpracticeType)
            .add({ imageUrl: url, time: curr_time });
    }
    async function download_link() {
        await getDownloadURL(ref(storageRef_1))
            .then((url) => {
                console.log("download url", url);
                updating_into_firestore(url);
            })
            .catch((error) => {
                console.log("errr", error);
            });
    }

};
const getmalpractice = async (req, res) => {
    const malpracticedata = []
    const studentmalpracticelist = await firebase_firestore.collection("exams").doc(req.body.examId).collection("candidates").doc(req.body.studentId).collection(req.body.malpracticeType).get();
    if (studentmalpracticelist.empty) {
        return res.status(200).json(malpracticedata);
    }
    else {
        studentmalpracticelist.forEach((doc) => {
            malpracticedata.push(doc.data())
        })
    }
    res.status(200).json(malpracticedata);
}
export { upload_face, malpractices, getmalpractice };

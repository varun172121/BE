import { MALPRACTICE_URL, UPLOAD_FACE_URL } from "../Constants/urls";
import { imageUploadRequest } from "../requestMethods";
import { snackActions } from "../Utils/SnackBarUtils";
import {
    setFaceRegistered,
    setFaceURL,
    setIsFaceUploading,
} from "../Features/questionPaperSlice";
import FormData from "form-data";

export const uploadPreExamFace = async (dispatch, image, examId) => {
    dispatch(setIsFaceUploading(true));
    console.log("uploadpreexam", image);
    const formData = new FormData();
    formData.append("image", image);
    // formData.append("type", uploadType);
    formData.append("examId", examId);
    try {
        await imageUploadRequest.post(UPLOAD_FACE_URL, formData).then((res) => {
            dispatch(setFaceRegistered(true));
            dispatch(setFaceURL(res.data.userImageLink));
            snackActions.success("Face uploaded successfully");
        });
    } catch (error) {
        snackActions.error(error.response.data);
    }
    dispatch(setIsFaceUploading(false));
};

export const sendExamEvent = async (image, examId, type) => {
    console.log("Event type: ", type);
    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("image", image);
    formData.append("malpracticeType", type);
    try {
        await imageUploadRequest.post(MALPRACTICE_URL, formData);
    } catch (error) {
        snackActions.error(error.response.data);
    }
};

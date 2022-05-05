import * as yup from "yup";

export const createExamValidation = yup.object().shape({
    examName: yup.string().required("Exam name is required"),
    examDesc: yup.string().required("Exam description is required"),
});

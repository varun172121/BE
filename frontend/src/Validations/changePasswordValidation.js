import * as yup from "yup";

export const changePasswordValidation = yup.object().shape({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .notOneOf(
            [yup.ref("oldPassword")],
            "New password cannot be the same as old password"
        ),
});

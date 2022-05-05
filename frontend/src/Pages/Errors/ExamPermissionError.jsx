import React from "react";
import ErrorTemplate from "./ErrorTemplate";
import ExamPermissionDeniedImage from "../../Assets/Images/permission_denied.svg";

function ExamPermissionError() {
    return (
        <ErrorTemplate
            title="Permission Denied"
            image={ExamPermissionDeniedImage}
        >
            You are not authorized to take this examination. Please contact your administrator.
        </ErrorTemplate>
    );
}

export default ExamPermissionError;

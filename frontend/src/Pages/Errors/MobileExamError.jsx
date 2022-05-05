import React from "react";
import MobileErrorImage from "../../Assets/Images/mobile_denied.svg";
import ErrorTemplate from "./ErrorTemplate";

function MobileExamError() {
    return (
        <ErrorTemplate image={MobileErrorImage} title={"Access Denied"}>
            This page is <strong>unavailable</strong> on mobile phones and
            tablets. Please use a <strong>desktop browser</strong> instead.
        </ErrorTemplate>
    );
}

export default MobileExamError;

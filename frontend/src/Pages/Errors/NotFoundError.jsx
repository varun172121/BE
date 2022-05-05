import React from 'react'
import ErrorTemplate from './ErrorTemplate'
import NotFound from "../../Assets/Images/not_found.svg"

function NotFoundError() {
    return (
        <ErrorTemplate
            title="404"
            image={NotFound}
        >
            Page not found. Please check the URL.
        </ErrorTemplate>
    )
}

export default NotFoundError

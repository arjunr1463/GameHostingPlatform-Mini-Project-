import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import "./ResetFailed.css";

function ResetFailed() {
    return (
        <div className="resetfailed">
            <div className="successContainer">
                <h3>An Error occurred while processing your request. Please try again!</h3>
                <ErrorIcon className="error"/>
            </div>
        </div>
    )
}

export default ResetFailed;

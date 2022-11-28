import React from 'react';
import './ForgotPasswordSuccess.css';
import DoneIcon from '@material-ui/icons/Done';

function ForgotPasswordSuccess() {
    return (
        <div classname="forgotpassword">
            <div className="successContainer">
                <h3>Password reset email has been successfully sent. Please check your email.</h3>
                <DoneIcon className="doneIcon" />
            </div>
        </div>
    )
}

export default ForgotPasswordSuccess;

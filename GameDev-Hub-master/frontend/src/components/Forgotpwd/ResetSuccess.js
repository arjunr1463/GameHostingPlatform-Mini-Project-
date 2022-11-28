import React from 'react';
import DoneIcon from '@material-ui/icons/Done';


function ResetSuccess() {
    return (
        <div className="resetsuccess">
            <div className="successContainer">
                <h3>Password has been successfully reset. Please login with your new password!</h3>
                <DoneIcon className="doneIcon" />
            </div>
        </div>
    )
}

export default ResetSuccess;
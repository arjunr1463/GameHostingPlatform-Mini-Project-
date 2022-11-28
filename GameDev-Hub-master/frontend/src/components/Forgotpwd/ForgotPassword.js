import React, {useState } from 'react';
import './ForgotPassword.css';



function ForgotPassword() {
    const [email, setEmail] = useState("");


    const passresetHandler = async (e) => {
        e.preventDefault();
        const data = {
            "email": email
        };
        await fetch("https://gamehalt.herokuapp.com/api/user/forgotpwd", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((finalRes) => {
                window.location.href = "/forgotpass/success";
            })
            .catch((err) => {
                window.location.href = "/login";
            });
    }

    return (
        <div className="forgotpassword">
            <form className="container" onSubmit={passresetHandler}>
                <h3>Enter your email to reset your password</h3>
                <input type="text" onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter your email" required />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ForgotPassword;

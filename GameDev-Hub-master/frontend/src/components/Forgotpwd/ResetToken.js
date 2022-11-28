import React, {useState, useEffect} from 'react';
import './ResetToken.css';

function ResetToken() {

    const [pass, setPass] = useState("");



    const passresetHandler = async (event) => {
        event.preventDefault();
        const data = {
            password: pass
        }
        await fetch(`https://gamehalt.herokuapp.com/api/user/reset/${window.location.href.split("/")[4]}`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((finalRes) => {
            console.log(finalRes);
            window.location.href = "/resetsuccess"
        })
        .catch((err) => {
            window.location.href = "/reseterr";
        });
    }

    return (
        <div className="resettoken">
            <form className="container" onSubmit={passresetHandler}>
                <h3>Enter your new password</h3>
                <input type="password" onChange={(e) => { setPass(e.target.value) }} placeholder="Enter password" required />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ResetToken;

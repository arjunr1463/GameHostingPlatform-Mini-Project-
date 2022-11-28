import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { BeatLoader } from "react-spinners";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [registering, setregistering] = useState(false);

  const sendRegisterInfo = async (event) => {
    setregistering(true);
    const data = {
      email: email,
      username: username,
      password: password,
    };
    event.preventDefault();
    await fetch("https://gamehalt.herokuapp.com/api/user/register", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((finalRes) => {
        if (!finalRes.accessToken) {
          setOpen(true);
          setResponse(finalRes);
        } else {
          localStorage.setItem("Access-Token", finalRes.accessToken);
          window.location.href = "/myprofile";
        }
      })
      .catch((err) => {
        setOpen(true);
        setResponse("Interal Server Error");
      });
      setregistering(false);
  };

  return (
    <div className="Register">
      <div
            className={registering ? "uploadspinnerContainer" : "nouploadSpinner"}
          >
            <BeatLoader size={50} color="red" loading />
          </div>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <CloseIcon
              fontSize="small"
              onClick={() => {
                setOpen(false);
              }}
            ></CloseIcon>
          }
        >
          {response}
        </Alert>
      </Collapse>
      <div className="register__container">
        <h1 className="mainheading2">Register</h1>
        <form onSubmit={sendRegisterInfo}>
          <div className="formContainer2">
            <div className="form-group-login2">
              <label>Username</label>
              <input
                className="form-control2"
                type="text"
                name="email"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                placeholder="username"
                required
              />
            </div>
            <div className="form-group-login2">
              <label>Email</label>
              <input
                className="form-control2"
                type="text"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                placeholder="email"
                required
              />
            </div>
            <div className="form-group-login2">
              <label>Password</label>
              <input
                className="form-control2"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                name="password"
                placeholder="********"
                required
              />
            </div>
          </div>
          <div className="buttonlinkContainer2">
            <button className="loginbtn2" type="submit">
              Register
            </button>
            <Link className="link2" to="/login">
              <h4>Login instead?</h4>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

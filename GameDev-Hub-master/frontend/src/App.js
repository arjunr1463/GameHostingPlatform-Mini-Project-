import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NavigationTab from "./components/Main/NavigationTab";
import Home from "./components/Home/Home";
import Upload from "./components/Main/Upload";
import AllGames from "./components/Main/AllGames";
import MyProfile from "./components/Main/MyProfile";
import Feed from './components/Feed/Feed';
import Reset from './components/Forgotpwd/ResetToken';
import GamePage from "./components/Main/GamePage";
import ResetSuccess from './components/Forgotpwd/ResetSuccess';
import ResetFail from './components/Forgotpwd/ResetFailed';
import ForgotPassword from './components/Forgotpwd/ForgotPassword';
import Landing from "./components/Main/Landing";
import Play from "./components/Main/Play";
import Chat from './components/chat/Chat';
import {UserContext, UserProvider} from './components/Context/UserContext';
import Teaser from "./components/Main/Teaser";
import ForgotPasswordSuccess from './components/Forgotpwd/ForgotPasswordSuccess';
import OtherProfile from "./components/Main/OtherProfile";
import NotFound from "./components/Main/NotFound";
import OtherTeasers from "./components/Teasers/OtherTeasers";
import PaymentError from "./components/Main/PaymentError";

function App() {
  
  return (
    <UserProvider>
    <div className="App">
    {localStorage.getItem("Access-Token") && (
      <Chat />)}
      <Router>
        {localStorage.getItem("Access-Token") && (
          <Route path="/" component={NavigationTab} />
        )}
        <Switch>
          <Route path="/pswdreset/:id" component={Reset} />
          <Route exact path="/resetfailed" component={ResetFail} />
          <Route exact path="/resetsuccess" component={ResetSuccess} />
          <Route path="/allgames" component={AllGames} />
          <Route path="/play" component={Play} />
          <Route path="/404" component={NotFound} />
          <Route exact path="/forgotpass/success" component={ForgotPasswordSuccess} />
          <Route exact path="/forgotpass" component={ForgotPassword} />
          <Route path="/paymenterror" component={PaymentError} />
          <Route path="/profile/*" component={OtherProfile} />
          <Route path="/game/*" component={GamePage} />
          <Route path="/createteaser" component={Teaser} />
          <Route path="/teaser/*" component={OtherTeasers} />

          {localStorage.getItem("Access-Token") && (
            <Route path="/explore" component={Landing} />
          )}

          {localStorage.getItem("Access-Token") && (
            <Route path="/feed" component={Feed} />
          )}

          {localStorage.getItem("Access-Token") && (
            <Route path="/myprofile" component={MyProfile} />
          )}

          {localStorage.getItem("Access-Token") && (
            <Route path="/upload" component={Upload} />
          )}

          {!localStorage.getItem("Access-Token") && (
            <Route path="/login" component={Login} />
          )}
          {!localStorage.getItem("Access-Token") && (
            <Route path="/register" component={Register} />
          )}
          {!localStorage.getItem("Access-Token") && (
            <Route path="/" component={MyProfile} />
          )}
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </div>
    </UserProvider>
  );
}

export default App;

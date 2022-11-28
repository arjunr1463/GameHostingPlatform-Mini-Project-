import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavigationTab.css";
import CloseIcon from "@material-ui/icons/Close";

function NavigationTab() {
  const logoutHandler = () => {
    localStorage.removeItem("Access-Token");
    window.location.href = "/login";
  };

  const [burgerOpen, setBurgerOpen] = useState(false);
  const [active, setActive] = useState("explore");

  useEffect(() => {
    const currentTab = window.location.href.split("/")[3];
    setActive(currentTab);
  }, []);

  const activeHandler = (tab) => {
    setActive(tab);
  };

  return (
    <nav className="navigation">
      <div>
        <Link className="logoContainer" to="/myprofile">
          <h3 className="logo">G</h3>
        </Link>
      </div>
      <div className="nav__options">
        {active === "explore" ? (
          <Link className="options_active" to="/explore">
            <h4 className="optionh4 redcolor">Explore</h4>
          </Link>
        ) : (
          <Link
            onClick={() => {
              activeHandler("explore");
            }}
            className="options_"
            to="/explore"
          >
            <h4 className="optionh4">Explore</h4>
          </Link>
        )}

        {active === "myprofile" ? (
          <Link className="options_active" to="/myprofile">
            <h4 className="optionh4 redcolor">My Profile</h4>
          </Link>
        ) : (
          <Link
            onClick={() => {
              activeHandler("myprofile");
            }}
            className="options_"
            to="/myprofile"
          >
            <h4 className="optionh4">My Profile</h4>
          </Link>
        )}
        {active === "allgames" ? (
          <Link className="options_active" to="/allgames">
            <h4 className="optionh4 redcolor">All Games</h4>
          </Link>
        ) : (
          <Link
            onClick={() => {
              activeHandler("allgames");
            }}
            className="options_"
            to="/allgames"
          >
            <h4 className="optionh4">All Games</h4>
          </Link>
        )}
        {active === "upload" ? (
          <Link className="options_active" to="/upload">
            <h4 className="optionh4 redcolor">Upload</h4>
          </Link>
        ) : (
          <Link
            onClick={() => {
              activeHandler("upload");
            }}
            className="options_"
            to="/upload"
          >
            <h4 className="optionh4">Upload</h4>
          </Link>
        )}

    {active === "news" ? (
          <Link className="options_active" to="/feed">
            <h4 className="optionh4 redcolor">News</h4>
          </Link>
        ) : (
          <Link
            onClick={() => {
              activeHandler("news");
            }}
            className="options_"
            to="/feed"
          >
            <h4 className="optionh4">News</h4>
          </Link>
        )}    

        {/**<h4 className="logout" onClick={logoutHandler}>
          Logout
          </h4>**/}
      </div>

      {burgerOpen ? (
        <div className="expanded_nav">
          <CloseIcon
            onClick={() => setBurgerOpen(false)}
            className="close"
          ></CloseIcon>
          <Link
            onClick={() => setBurgerOpen(false)}
            className="options"
            to="/feed"
          >
            <h4 className="option">News</h4>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            className="options"
            to="/explore"
          >
            <h4 className="option">Explore</h4>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            className="options"
            to="/myprofile"
          >
            <h4 className="option">My Profile</h4>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            className="options"
            to="/allgames"
          >
            <h4 className="option">All Games</h4>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            className="options"
            to="/upload"
          >
            <h4 className="option">Upload</h4>
          </Link>
          <h4
            className="options redcolor"
            style={{ cursor: "pointer" }}
            onClick={logoutHandler}
          >
            Logout
          </h4>
        </div>
      ) : (
        <div className="burger" onClick={() => setBurgerOpen(true)}>
          <div className="one"></div>
          <div className="two"></div>
          <div className="three"></div>
        </div>
      )}
    </nav>
  );
}

export default NavigationTab;

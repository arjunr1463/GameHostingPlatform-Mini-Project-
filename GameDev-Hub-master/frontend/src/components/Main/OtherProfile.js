import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

function OtherProfile() {
  const [mygames, setMygames] = useState([]);
  const [me, setMe] = useState([]);
  const [letter, setLetter] = useState("");
  const [createdgamesexpanded, setCreatedgamesexpanded] = useState(false);
  const [myfavsexpanded, setMyfavsexpanded] = useState(false);

  const [myfavourites, setmyfavourites] = useState([]);

  useEffect(() => {
    const author = window.location.href.split("/")[4];
    console.log(author);
    const myCreatedGames = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/${author}/createdgames`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((finalRes) => {
          setMygames(finalRes);
        })
        .catch((err) => {
          console.log(err);
          window.location.href = "/404";
        });
    };

    const myfav = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/${author}/favouritegames`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          //console.log(finalRes3);
          setmyfavourites(finalRes3);
        })
        .catch((err) => {
          console.log(err);
          window.location.href = "/404";
        });
    };

    const me = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/profile/${author}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((finalRes2) => {
          console.log(finalRes2);
          if (finalRes2.message === "User does not exist") {
            window.location.href = "/404";
          }
          setLetter(finalRes2.username.slice(0, 1).toUpperCase());
          setMe(finalRes2);
        })
        .catch((err) => {
          console.log(err);
          window.location.href = "/404";
        });
    };
    me();
    myCreatedGames();
    myfav();
  }, []);

  return (
    <div className="profile">
      <h1 className="profile__heading">{me.username}'s PROFILE</h1>
      <div className="usersection">
        <div className="logo__username">
          <div className="avatar">
            {
              me.profilepic ? (
                <img style={{
                  height: "240px",
                  width: "240px",
                  borderRadius: "50%"
                }} src={'https://gamehalt.herokuapp.com/profilepic/' + me.profilepic} />
              ) : (
                <h1 style={{ color: "white" }}>{letter}</h1>
              )
            }
          </div>
          <h3>{me.username}</h3>
        </div>
        <div className="stats">
          <h2 style={{ marginTop: "20px", fontWeight: "800", color: "white" }}>
            STATS
          </h2>
          <div className="statsoptions">
            <p>Rating: -</p>
            <p>Created Games: {me.noOfCreatedGames}</p>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "red",
          height: "3px",
          marginLeft: "auto",
          marginBottom: "20px",
          marginRight: "auto",
          width: "70%",
        }}
      ></div>

<div className="aboutmetitlecontainer">
        <h2>About Me</h2>
      </div>
      <div className="aboutme" style={{height: "fit-content"}}>
        <div className="aboutmecontent">
                <h2 style={{ color: "white", padding: "10px", fontSize: "20px", fontWeight: "400", textAlign: "center" }}>{me.aboutme}</h2>
        </div>
      </div>

      <div className="gamesection">
        <div className="createdgamesRow">
          <div className="createdgame">
            <h2 style={{ color: "red", fontWeight: "400" }}>Created Games</h2>
            <KeyboardArrowDownIcon
              onClick={() => {
                setCreatedgamesexpanded(!createdgamesexpanded);
              }}
            />
          </div>
          {createdgamesexpanded ? (
            <div className="createdgamesSection">
              {mygames.map((each) => (
                <div key={each._id} className="eachgame">
                  <div className="gameimg">
                    <img
                      style={{
                        height: "260px",
                        width: "240px",
                        marginBottom: "10px",
                      }}
                      src={each.imageURL}
                      alt=""
                    />
                  </div>
                  <div className="gameinfo">
                    <Link className="gameinfo_link" to={"/game/" + each._id}>
                      <h2>{each.name}</h2>
                    </Link>
                    <h3>{each.description}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div
          style={{
            backgroundColor: "red",
            height: "3px",
            marginLeft: "auto",
            marginBottom: "20px",
            marginRight: "auto",
            width: "70%",
          }}
        ></div>
        <div className="favgamesRow">
          <div className="favgame">
            <h2 style={{ color: "red", fontWeight: "400" }}>My Favourites</h2>
            <KeyboardArrowDownIcon
              onClick={() => {
                setMyfavsexpanded(!myfavsexpanded);
              }}
            />
          </div>
          {myfavsexpanded ? (
            <div className="favgamessection">
              {myfavourites.map((each) => (
                <div key={each._id} className="faveachgame">
                  <div className="favgameimg">
                    <img
                      style={{
                        height: "240px",
                        width: "190px",
                        marginBottom: "20px",
                      }}
                      src={each.imageURL}
                      alt=""
                    />
                  </div>
                  <div className="gameinfo">
                    <Link className="gameinfo_link" to={"/game/" + each._id}>
                      <h2>{each.name}</h2>
                    </Link>
                    <h3>{each.description}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;

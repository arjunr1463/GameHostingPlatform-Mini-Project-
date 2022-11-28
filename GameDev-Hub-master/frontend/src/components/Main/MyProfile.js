import React, { useEffect, useState, useContext } from "react";
import "./MyProfile.css";
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import EditIcon from '@material-ui/icons/Edit';
import { UserContext } from '../Context/UserContext';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

function MyProfile() {
  const [mygames, setMygames] = useState([]);
  const [me, setMe] = useState([]);
  const [editing, setEditing] = useState(false);
  const [aboutme, setAboutme] = useState('');
  const [otherinfoexpanded, setOtherinfoexpanded] = useState(false);
  const [letter, setLetter] = useState("");
  const [createdgamesexpanded, setCreatedgamesexpanded] = useState(false);
  const [myfavsexpanded, setMyfavsexpanded] = useState(false);
  const [myfavourites, setmyfavourites] = useState([]);
  const [temp, setTemp] = useState(0);
  const [files, setFiles] = useState();

  useEffect(() => {
    const myCreatedGames = async () => {
      await fetch("https://gamehalt.herokuapp.com/proxy/mycreatedgames", {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes) => {
          // console.log(finalRes);
          setMygames(finalRes);
        })
        .catch((err) => {
          //console.log(err);
          localStorage.removeItem("Access-Token");
          localStorage.removeItem('user');
          window.location.href = "/login";
        });
    };

    const myfav = async () => {
      await fetch("https://gamehalt.herokuapp.com/proxy/myfavouritegames", {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          //console.log(finalRes3);
          setmyfavourites(finalRes3);
        })
        .catch((err) => {
          //console.log(err);
          localStorage.removeItem("Access-Token");
          localStorage.removeItem('user');
          window.location.href = "/login";
        });
    };


    const me = async () => {
      await fetch("https://gamehalt.herokuapp.com/api/user/me", {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes2) => {
          //console.log("me::::" + finalRes2.username);
          setAboutme(finalRes2.aboutme);
          setLetter(finalRes2.username.slice(0, 1).toUpperCase());
          setMe(finalRes2);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("Access-Token");
          localStorage.removeItem('user');
          window.location.href = "/login";
        });
    };
    me();
    myCreatedGames();
    myfav();
  }, [temp]);

  const [currentUser, setCurrentUser] = useContext(UserContext);
  localStorage.setItem('user', me.username);
  setCurrentUser(me.username);

  const logoutHandler = () => {
    localStorage.removeItem("Access-Token");
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const removefavHandler = async (event) => {
    event.preventDefault();
    await fetch(
      `https://gamehalt.herokuapp.com/proxy/${event.target.value}/removefavourite`,
      {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      }
    )
      .then((res) => res.json())
      .then((finalRes3) => {
        console.log(finalRes3);
        setTemp(Date.now());
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("Access-Token");
        localStorage.removeItem('user');
        window.location.href = "/login";
      });
  };

  const playHandler = (id) => {
    window.open(`http://localhost:3000/play?game=${id}`, "_blank");
  };


  const onDrop = async (acceptedFile) => {
    console.log(acceptedFile[0]);
    const formData = new FormData();
    //for (const i in files) {
    //console.log(files[i]);
    formData.append("image", acceptedFile[0]);
    //}
    await fetch("https://gamehalt.herokuapp.com/proxy/me/profilepic/upload", {
      method: "POST",
      headers: {
        "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
      },
      body: formData,
    }).then(res => res.json()).then(final => {
      console.log(final);
      setTemp(Date.now())
    }).catch(err => {
      console.log('finale');
    })
    console.log(formData);
  };


  return (
    <div className="profile">
      {(document.cookie = `token=${localStorage.getItem("Access-Token")}`)}
      <h1 className="profile__heading">MY PROFILE</h1>
      <div className="usersection">
        <div className="logo__username">
          <div className="avatar">
            {
              (me.profilepic) ? (
                <Dropzone className="dropzone" onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="imageUpload"  {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img src={'https://gamehalt.herokuapp.com/profilepic/' + me.profilepic} />
                    </div>
                  )}
                </Dropzone>
              ) : (
                  <Dropzone className="dropzone" onDrop={onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="imageUpload" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <h1 style={{ color: "white" }}>{letter}</h1>
                      </div>
                    )}
                  </Dropzone>
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
      <div className="aboutme">
        <div className="editIconcontainer">
          <EditIcon className={editing ? "nodisp" : "editicon"} onClick={() => { setEditing(!editing) }} />
        </div>
        <div className="aboutmecontent">
          {
            editing ? (
              <div className="content">
                <textarea cols="20" rows="6" placeholder="Enter your bio..." onChange={(e) => { setAboutme(e.target.value) }} value={aboutme} style={{ color: 'white', height: 'fit-content' }} >{me.aboutme}</textarea>
                <button onClick={async () => {
                  setEditing(!editing)
                  const data = {
                    aboutme: aboutme
                  }
                  console.log(JSON.stringify(data));
                  await fetch('https://gamehalt.herokuapp.com/proxy/me/aboutme/update', {
                    method: 'POST',
                    headers: {
                      "Access-Token": 'Bearer ' + localStorage.getItem('Access-Token'),
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                  }).then(res => res.json()).then(final => {
                    setTemp(Date.now())
                  }).catch(err => {
                    console.log(err);
                  })
                }}>Save</button>
              </div>

            ) : (
                <h2 style={{ color: "white", padding: "10px", fontSize: "19px", fontWeight: "400", textAlign: "center" }}>{me.aboutme}</h2>
              )
          }
        </div>
      </div>

      <div className="gamesection">
        <div className="otherInfoHeading" style={{cursor: 
        'pointer'}} onClick={() => {
              setOtherinfoexpanded(!otherinfoexpanded);
            }}>
          <h2 style={{ color: "red", fontWeight: "400" }}>Other Info</h2>
          <KeyboardArrowDownIcon
            onClick={() => {
              setOtherinfoexpanded(!otherinfoexpanded);
            }}
          />
        </div>
        {otherinfoexpanded ? <div className="otherinfoexpanded">
          <div className="upcomingPayments">

            <h3 style={{ fontWeight: '400' }}>Upcoming Payments: </h3><h1 style={{ fontWeight: '400' }}>${me.upcomingPayments}</h1>

          </div>
        </div> : null}

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
        <div className="createdgamesRow">
          <div style={{cursor: 'pointer'}} className="createdgame" onClick={() => {
                setCreatedgamesexpanded(!createdgamesexpanded);
              }}>
            <h2 style={{ color: "red", fontWeight: "400" }}>Created Games</h2>
            <KeyboardArrowDownIcon
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
                    <PlayCircleOutlineIcon
                      className="play_btn"
                      onClick={() => {
                        playHandler(each._id);
                      }}
                    >
                      Play
                    </PlayCircleOutlineIcon>
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
        <div className="favgamesRow"  style={{cursor: 'pointer'}}  onClick={() => {
                setMyfavsexpanded(!myfavsexpanded);
              }}>
          <div className="favgame">
            <h2 style={{ color: "red", fontWeight: "400" }}>My Favourites</h2>
            <KeyboardArrowDownIcon
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
                    <div>
                      <button style={{
                        backgroundColor: 'rgb(156, 15, 15)',
                        width: '100px',
                        borderRadius: '10px'
                      }} value={each._id} onClick={removefavHandler}>
                       Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
        <button onClick={logoutHandler} className="logout">Logout</button>

      </div>
    </div>
  );
}

export default MyProfile;

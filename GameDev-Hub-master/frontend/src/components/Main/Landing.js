import React, { useState, useEffect } from "react";
import "./Landing.css";
import Trending from "../LandingComp/Trending";
import { Link } from "react-router-dom";
import banner_img from "../../assets/bannerimg.png";

function Landing() {
  const [trending, setTrending] = useState([]);
  const [mostfavourites, setmostfavourites] = useState([]);
  const [upcomingreleases, setupcomingreleases] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const getTrending = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/trending`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          console.log(finalRes3);
          setTrending(finalRes3);
        })
        .catch((err) => {
          localStorage.removeItem("Access-Token");
          window.location.href = "/login";
        });
    };

    const getTrailers = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/teasers`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          setTrailers(finalRes3);
        })
        .catch((err) => {
          localStorage.removeItem("Access-Token");
          window.location.href = "/login";
        });
    };

    const getReleases = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/schedules`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          console.log(finalRes3);
          setupcomingreleases(finalRes3);
        })
        .catch((err) => {
          localStorage.removeItem("Access-Token");
          window.location.href = "/login";
        });
    };

    const getMostFavourites = async () => {
      await fetch(`https://gamehalt.herokuapp.com/proxy/mostfavourites`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          console.log(finalRes3);
          setmostfavourites(finalRes3);
        })
        .catch((err) => {
          localStorage.removeItem("Access-Token");
          window.location.href = "/login";
        });
    };
    getReleases();
    getTrailers();
    getMostFavourites();
    getTrending();
  }, []);

  return (
    <div className="landing">
      <div className="banner">
        <img alt="bannerimg" className="banner_img" src={banner_img} />
      </div>

      <div className="trending_">
        <h2
          style={{
            color: "red",
            marginTop: "30px",
            letterSpacing: "1",
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "95%",
          }}
        >
          Upcoming Releases
        </h2>
        <div className="upcomingreleases">
          {upcomingreleases.map((each) => (
            <div key={each._id} className="eachUpcoming">
              <div className="upcoming">
                <img
                  alt="upcomging release"
                  style={{
                    textAlign: "center",
                    borderRadius: "50%",
                    height: "250px",
                    width: "250px",
                  }}
                  className="upcoming_img"
                  src={each.imageURL}
                />
                <div className="textContain">
                  <h3
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                      marginLeft: "-20px",
                      color: "white",
                    }}
                  >
                    {each.name}
                  </h3>
                  <p
                    style={{
                      textAlign: "center",
                      color: "darkgray",
                      marginLeft: "-15px",
                    }}
                  >
                    Releasing on {each.release}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2
        style={{
          color: "red",
          marginTop: "30px",
          marginBottom: "20px",
          marginLeft: "auto",
          letterSpacing: "1",
          marginRight: "auto",
          width: "95%",
        }}
      >
        Trailers
      </h2>

      <div className="trailers_row">
        {trailers.map((each) => (
          <div key={each._id} className="eachTrailer">
            <img alt="trailers" src={each.coverimageurl} />
            <div className="trailerinfo">
              <h2 style={{ color: "red" }}>{each.name}</h2>
              <h4>{each.description}</h4>
              <Link className="trailer_view" to={"/teaser/" + each._id}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="trending_">
        <h2
          style={{
            color: "red",
            marginTop: "30px",
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "95%",
          }}
        >
          Trending Now
        </h2>
        <div className="trendingrow">
          {trending.map((each) => (
            <div key={each._id} className="eachTrending">
              <Link
                style={{ textDecoration: "none", color: "darkgray" }}
                to={"/game/" + each._id}
              >
                <Trending image={each.imageURL} />
                <h3>{each.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ marginTop: "20px", marginBottom: "80px" }}
        className="mostfavs_"
      >
        <h2
          style={{
            color: "red",
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "95%",
          }}
        >
          Most Favourites
        </h2>
        <div className="favsrow">
          {mostfavourites.map((each) => (
            <div key={each._id} className="eachfav">
              <Link
                style={{ textDecoration: "none", color: "darkgray" }}
                to={"/game/" + each._id}
              >
                <Trending image={each.imageURL} />
                <h3 className="eachfav_name">{each.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;

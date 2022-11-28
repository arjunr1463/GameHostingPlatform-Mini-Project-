import React, { useEffect, useState } from "react";
import "./Play.css";

function Play() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    if (!param.has("game")) {
      setUrl("");
    } else {
      console.log(param.get("game"));
      setUrl(param.get("game"));
    }
  }, []);

  return (
    <>
    <iframe
      title="iframe-title"
      className="gameiframe"
      src={"https://gamehalt.herokuapp.com/games/zips/" + new URLSearchParams(window.location.search).get("game") + "/index.html"}
    ></iframe>
    </>
  );
}

export default Play;

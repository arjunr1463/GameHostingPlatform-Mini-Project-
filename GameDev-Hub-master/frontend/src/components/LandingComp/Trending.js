import React from "react";
import "./Trending.css";

function Trending(props) {
  return (
    <div className="trending">
      <img alt="trending" className="trending_images" src={props.image} />
    </div>
  );
}

export default Trending;

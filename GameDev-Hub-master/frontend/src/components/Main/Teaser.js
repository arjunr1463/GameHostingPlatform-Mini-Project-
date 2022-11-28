import React, { useState } from "react";
import Dropzone from "react-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import { BeatLoader } from "react-spinners";
import "./Teaser.css";

function Teaser() {
  const [desc, setDesc] = useState("");
  const [fee, setFee] = useState("");
  const [uploading, setuploading] = useState(false);
  const [category, setcategory] = useState("action");
  const [platform, setplatform] = useState("Mac");
  const [schedule, setSchedule] = useState("");
  const [video, setVideo] = useState();
  //const [imagenames, setimagenames] = useState([]);
  const [videoname, setvideoname] = useState("");
  const [name, setName] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState();

  const submitHandler = async (e) => {
    setuploading(true);
    e.preventDefault();
    console.log(files);
    const formData = new FormData();
    formData.append("release", schedule);
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("fee", fee);
    formData.append("img", url);
    formData.append("platform", platform);
    formData.append("category", category);
    let count = 0;
    console.log(files);
    for (const i in files) {
      formData.append("files", files[i]);
      count = count + 1;
    }
    for (const i in video) {
      formData.append("video", video[i]);
    }
    formData.append("fileCount", count);

    console.log(formData);
    const response = await fetch(
      "http://localhost:5000/proxy/teaser/upload/new",
      {
        method: "POST",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
        body: formData,
      }
    );
    console.log(response);
    window.location.href = "/myprofile";
    return false;
  };

  const onDrop = (acceptedFiles) => {
    console.log("dropped");
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
    setImageCount(acceptedFiles.length);
  };

  const onDrop2 = (acceptedFiles) => {
    console.log("dropped");
    setvideoname(acceptedFiles[0].name);
    setVideo(acceptedFiles);
  };

  const categoryHandler = (e) => {
    setcategory(e.target.value);
  };

  const platformHandler = (e) => {
    setplatform(e.target.value);
  };

  return (
    <div className="teaser">
      <div
        className={uploading ? "uploadspinnerContainer" : "nouploadSpinner"}
      >
        <BeatLoader size={50} color="red" loading />
      </div>
      <h1
        style={{
          marginTop: "150px",
          fontSize: "800",
          color: "red",
        }}
      >
        Publish Teaser
      </h1>
      <div className="upload_form" style={{ marginTop: "50px" }}>
        <form onSubmit={submitHandler}>
          <div className="name" style={{ marginTop: "-10px" }}>
            <label className="namel" htmlFor="">
              Name:
            </label>
            <input
              type="text"
              placeholder="Name of the game"
              name="gname"
              onChange={(event) => setName(event.target.value)}
              value={name}
              placeholder="Name of the game"
              required
            />
          </div>
          <div className="name">
            <label className="descl">Short Description:</label>
            <input
              type="text"
              name="sdescription"
              onChange={(event) => setDesc(event.target.value)}
              value={desc}
              placeholder="Description"
              maxLength="500"
              required
            />
          </div>

          <div className="name3">
            <label className="imgl">Cover image URL:</label>
            <input
              type="text"
              name="imgurl"
              onChange={(event) => setUrl(event.target.value)}
              value={url}
              placeholder="Cover image of the game."
              required
            />
          </div>

          <div className="name3">
            <label className="imgl">Purchase Fee($):</label>
            <input
              type="text"
              name="fee"
              onChange={(event) => setFee(event.target.value)}
              value={fee}
              placeholder="Leave it blank, if no fee to be incurred"
              maxLength="10"
            />
          </div>
          <div className="name4">
            <label className="imgl">Select category:</label>
            <select
              onChange={categoryHandler}
              className="categories"
              name="category"
            >
              <option value="action">Action</option>
              <option value="roleplaying">Role Playing</option>
              <option value="simulation">Simulation</option>
              <option value="sports">Sports</option>
              <option value="strategy">Strategy</option>
            </select>
          </div>
          <div className="name4">
            <label className="imgl" htmlFor="">
              Select Platform:
            </label>
            <select
              onChange={platformHandler}
              className="platforms"
              name="platform"
            >
              <option value="Mac">Mac</option>
              <option value="WebGL">WebGL</option>
              <option value="windows">Windows</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Linux">Linux</option>
            </select>
          </div>
          <div className="name4">
            <label for="datetime">Release date:</label>
            <input
              onChange={(e) => {
                setSchedule(e.target.value);
              }}
              className="date_time"
              type="date"
              name="datetime"
            />
          </div>
          {

            files ? (
              <div className="imageContainer" style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
                <div>
                  <CloseIcon
                    style={{ zIndex: "200", marginTop: "20px", color: "white", cursor: "pointer", float: "right", marginRight: "30px" }}
                    onClick={() => {
                      setFiles();
                    }}
                  />
                </div>
                {
                  files.map((each, index) => (
                    <div key={index} className="filenameContainer" style={{ marginTop: "5px", width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                      <div style={{ color: "white" }} className="filenameindicator">
                        <h3>{each.name}</h3>
                      </div>

                    </div>
                  ))
                }
              </div>

            ) : (
                <div style={{ marginTop: "40px" }}>
                  <Dropzone className="" onDrop={onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="droparea" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <h3 style={{ color: "darkgray", padding: "80px" }}>
                          Drag & Drop some early game images Images (.png)</h3>
                      </div>
                    )}
                  </Dropzone>
                </div>
              )
          }


          {videoname ? (
            <div className="filenameContainer" style={{ marginTop: "40px" }}>
              <div style={{ color: "white" }} className="filenameindicator">
                <h3>{videoname}</h3>
              </div>
              <div>
                <CloseIcon
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => {
                    setvideoname("");
                    setVideo();
                  }}
                />
              </div>
            </div>
          ) : (
              <div className="" style={{ marginTop: "40px" }}>
                <Dropzone className="dropzone" onDrop={onDrop2}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="droparea" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <h3 style={{ color: "darkgray", padding: "80px" }}>
                        Drag & Drop Trailer movie (.mp4)
                    </h3>
                    </div>
                  )}
                </Dropzone>
              </div>
            )}

          <button className="create" type="submit" value="Create">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
export default Teaser;

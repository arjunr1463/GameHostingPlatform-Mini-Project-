import React, { useState } from "react";
import "./Upload.css";
import Dropzone from "react-dropzone";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';


function Upload() {
  const [desc, setDesc] = useState("");
  const [longdesc, setlongDesc] = useState("");
  const [progress, setProgress] = useState(0);
  const [fee, setFee] = useState("");
  const [category, setcategory] = useState("action");
  const [platform, setplatform] = useState("Mac");
  const [datetime, setdatetime] = useState("");
  const [uploading, setuploading] = useState(false);
  const [imgurl, setImgURL] = useState("");
  const [filename, setFilename] = useState("");
  const [amorpm, setamorpm] = useState("0");
  const [hosturl, setHostURL] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [name, setName] = useState("");
  const [files, setFiles] = useState();

  const changeScheduleOption = () => {
    setSchedule(!schedule);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setuploading(true);
    console.log(files);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sdesc", desc);
    formData.append("imgurl", imgurl);
    formData.append("hosturl", hosturl);
    formData.append("ldesc", longdesc);
    formData.append("fee", fee);
    formData.append("platform", platform);
    formData.append("category", category);
    let count = 0;
    for (const i in files) {
      formData.append("files", files[i]);
      count = count + 1;
    }
    formData.append("fileCount", count);

    console.log(formData);

    axios({
      method: "post",
      url: "https://gamehalt.herokuapp.com/proxy/create/game",
      data: formData,
      headers: {
        "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
      },
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted);
        console.log(percentCompleted);
      }
    })
      .then(function (response) {
        console.log('upload success')
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });

    /*const response = await fetch("https://gamehalt.herokuapp.com/proxy/create/game", {
      method: "POST",
      headers: {
        "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
      },
      body: formData,
    });
    console.log(response);*/
    //window.location.href = "/myprofile";
    //return false;
  };

  const scheduledFormHandler = async (e) => {
    e.preventDefault();
    console.log(files);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sdesc", desc);
    formData.append("imgurl", imgurl);
    formData.append("hosturl", hosturl);
    formData.append("ldesc", longdesc);
    formData.append("fee", fee);
    formData.append("platform", platform);
    formData.append("amorpm", amorpm);
    console.log(amorpm);
    formData.append("datetime", datetime);
    console.log(datetime);

    formData.append("category", category);
    let count = 0;
    for (const i in files) {
      formData.append("files", files[i]);
      count = count + 1;
    }
    formData.append("fileCount", count);

    console.log(formData);
    const response = await fetch("https://gamehalt.herokuapp.com/proxy/schedule", {
      method: "POST",
      headers: {
        "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
      },
      body: formData,
    });

    console.log(response);
    window.location.href = "/myprofile?state=true";
    return false;
  };

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles[0].name);
    setFilename(acceptedFiles[0].name);
    console.log("zip dropped");
    setFiles(acceptedFiles);
    console.log(acceptedFiles);
  };

  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="upload">
      <div className="upload_options">
        {schedule ? (
          <button onClick={changeScheduleOption}>Dont Schedule?</button>
        ) : (
          <button onClick={changeScheduleOption}>Schedule Release?</button>
        )}
        <Link style={{ color: "red", marginTop: "5px" }} to="/createteaser">
          Create Teaser Instead?
        </Link>
      </div>

      {schedule ? (
        <div className="upload_form">
          <div
            className={uploading ? "uploadspinnerContainer" : "nouploadSpinner"}
          >
            <BeatLoader size={50} color="red" loading />
          </div>
          <form onSubmit={scheduledFormHandler}>
            <div className="name4">
              <label for="datetime">Schedule date and time:</label>
              <input
                className="date_time"
                type="datetime-local"
                name="datetime"
                onChange={(e) => setdatetime(e.target.value)}
              />
            </div>
            <div className="name4">
              <label className="namel" htmlFor="">
                AM/PM:
              </label>
              <select
                onChange={(e) => setamorpm(e.target.value)}
                className="platforms"
                name="amorpm"
              >
                <option value="0">AM</option>
                <option value="1">PM</option>
              </select>
            </div>
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
              <label className="descl" htmlFor="">
                Short Description:{" "}
              </label>
              <input
                type="text"
                name="sdescription"
                onChange={(event) => setDesc(event.target.value)}
                value={desc}
                placeholder="Not more than 200 chars"
                maxLength="200"
                required
              />
            </div>
            <div className="name2">
              <label className="descl" htmlFor="">
                Long Description:{" "}
              </label>
              <textarea
                type="text"
                name="ldescription"
                onChange={(event) => setlongDesc(event.target.value)}
                value={longdesc}
                placeholder="Description on game(markdown supported)"
                required
              />
            </div>
            <div className="name3">
              <label className="imgl" htmlFor="">
                Purchase Fee($):
              </label>
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
              <label className="imgl" htmlFor="">
                Select category:
              </label>
              <select
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
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
                onChange={(e) => {
                  setplatform(e.target.value);
                }}
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
            <div className="name">
              <label className="imgl" htmlFor="">
                Cover Image URL:{" "}
              </label>
              <input
                type="url"
                name="imageURL"
                onChange={(event) => setImgURL(event.target.value)}
                value={imgurl}
                placeholder="Cover image for the game"
                required
              />
            </div>
            <div className="name">
              <label className="hostl" htmlFor="">
                Hosted URL<span>(Already Hosted?):</span>
              </label>
              <input
                type="url"
                name="hostURL"
                onChange={(event) => setHostURL(event.target.value)}
                value={hosturl}
                placeholder="URL to hosted game"
              />
            </div>
            {filename ? (
              <div className="filenameContainer">
                <div style={{ color: "white" }} className="filenameindicator">
                  <h3>{filename}</h3>
                </div>
                <div>
                <CircularProgressWithLabel className="circularprogress" value={100} />
                  <CloseIcon
                    style={{ color: "white" }}
                    onClick={() => {
                      setFilename("");
                      setFiles();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="">
                <Dropzone className="dropzone" onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="droparea" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <h3 style={{ color: "darkgray", padding: "80px" }}>
                        Drag & Drop File (.zip)
                      </h3>
                    </div>
                  )}
                </Dropzone>
              </div>
            )}
            <button className="create" type="submit" value="Create">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="upload_form">
          <div
            className={uploading ? "uploadspinnerContainer" : "nouploadSpinner"}
          >
            <BeatLoader size={50} color="red" loading />
          </div>
          <form onSubmit={submitHandler}>
            <div className="name">
              <label className="namel" htmlFor="">
                Name:{" "}
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
              <label className="descl" htmlFor="">
                Short Description:{" "}
              </label>
              <input
                type="text"
                name="sdescription"
                onChange={(event) => setDesc(event.target.value)}
                value={desc}
                placeholder="Not more than 200 chars"
                maxLength="200"
                required
              />
            </div>
            <div className="name2">
              <label className="descl" htmlFor="">
                Long Description:{" "}
              </label>
              <textarea
                type="text"
                name="ldescription"
                onChange={(event) => setlongDesc(event.target.value)}
                value={longdesc}
                placeholder="Description on game(markdown supported)"
                required
              />
            </div>
            <div className="name3">
              <label className="imgl" htmlFor="">
                Purchase Fee($):
              </label>
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
              <label className="imgl" htmlFor="">
                Select category:
              </label>
              <select
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
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
                onChange={(e) => {
                  setplatform(e.target.value);
                }}
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
            <div className="name">
              <label className="imgl" htmlFor="">
                Cover Image URL:{" "}
              </label>
              <input
                type="url"
                name="imageURL"
                onChange={(event) => setImgURL(event.target.value)}
                value={imgurl}
                placeholder="Cover image for the game"
                required
              />
            </div>
            <div className="name">
              <label className="hostl" htmlFor="">
                Hosted URL<span>(Already Hosted?):</span>
              </label>
              <input
                type="url"
                name="hostURL"
                onChange={(event) => setHostURL(event.target.value)}
                value={hosturl}
                placeholder="URL to hosted game"
              />
            </div>

            {filename ? (
              <div className="filenameContainer">
                <div style={{ color: "white" }} className="filenameindicator">
                  <h3>{filename}</h3>
                </div>
                <div>
                  <CloseIcon
                    style={{ color: "white" }}
                    onClick={() => {
                      setFilename("");
                      setFiles();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="">
                <Dropzone className="dropzone" onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="droparea" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <h3 style={{ color: "darkgray", padding: "80px" }}>
                        Drag & Drop File (.zip)
                      </h3>
                    </div>
                  )}
                </Dropzone>
              </div>
            )}

            <button className="create" type="submit" value="Create">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Upload;

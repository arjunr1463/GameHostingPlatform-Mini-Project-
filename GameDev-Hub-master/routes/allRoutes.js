const jwtVerification = require("./jwtVerification");
const router = require("express").Router();
const Game = require("../models/gameModel");
const Teaser = require("../models/teaserModel");
const paypal = require("paypal-rest-sdk");
const decompress = require("decompress");
const User = require("../models/userModel");
const formidable = require("express-formidable");
const Schedule = require("../models/scheduleModel");
const schedule = require("node-schedule");
const fs = require("fs");
const path = require("path");
const Comment = require("../models/commentModel");

// Schedule routes

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const unzipRar = async (targetPath, gameid) => {
  let extension = targetPath.substr(targetPath.length - 4);
  console.log(extension);
  if (extension === ".zip" || ".rar") {
    fs.mkdir(`./uploads/games/zips/${gameid}`, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("folder created:::" + gameid);
    });

    await decompress(targetPath, `./uploads/games/zips/${gameid}`).then(
      (files) => {
        console.log(files);
      }
    );
  }
};

router.post(
  "/schedule",
  formidable({
    encoding: "utf-8",
    uploadDir: "./uploads/games/zips",
    multiples: false,
  }),
  jwtVerification,
  async (req, res) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    if (!user) return res.json("Internal Server Error");

    const filename = req.files.files.path.match(/(\upload_.*)/g).toString();
    let newfilename;
    if (req.files.files.type === "application/x-zip-compressed") {
      newfilename = filename + ".zip";
    } else {
      newfilename = filename + ".rar";
    }

    fs.renameSync(
      `./uploads/games/zips/${filename}`,
      `./uploads/games/zips/${newfilename}`
    );

    if (!req.fields.fee) {
      req.fields.fee = "Free";
    }
    if (!req.fields.hosturl) {
      req.fields.hosturl = "";
    }

    let datetime = req.fields.datetime;
    let amorpm = req.fields.amorpm;
    let temp = datetime.split("T");
    let date = temp[0].split("-");
    let time = temp[1].split(":");
    const releaseDate = date[2] + "/" + date[1] + "/" + date[0];

    const newSchedule = new Schedule({
      release: releaseDate,
      name: req.fields.name,
      gameFile: newfilename,
      longdescription: req.fields.ldesc,
      description: req.fields.sdesc,
      creator: user.username,
      category: req.fields.category,
      platform: req.fields.platform,
      price: req.fields.fee,
      imageURL: req.fields.imgurl,
      hostURL: req.fields.hosturl,
    });

    console.log(
      date[0] +
        " " +
        (parseInt(date[1]) - 1) +
        " " +
        date[2] +
        " " +
        time[0] +
        " " +
        time[1] +
        " " +
        amorpm
    );

    const scheduleNewJob = async (
      year,
      month,
      date,
      hour,
      minutes,
      amorpm,
      id,
      user
    ) => {
      let newdate = new Date(year, month, date, hour, minutes, amorpm);

      console.log("New release scheduled on " + newdate);
      let j = schedule.scheduleJob(newdate, async function () {
        const game = await Schedule.findOne({
          _id: id,
        });

        const newgame_ = new Game({
          name: game.name,
          gameFile: game.gameFile,
          longdescription: game.longdescription,
          description: game.description,
          creator: game.creator,
          category: game.category,
          platform: game.platform,
          price: game.price,
          imageURL: game.imageURL,
          hostURL: game.hostURL,
        });

        await user.createdGames.push(newgame_._id);
        user.noOfCreatedGames += 1;

        await user.save().then().catch();
        await newgame_
          .save()
          .then()
          .catch((err) => {
            console.log(err);
          });

        await Schedule.deleteOne({ _id: id }, (err) => {
          if (err) {
            console.log(err);
          }
          console.log(":::::::successfully deleted from schedule!");
        });

        console.log("Now Released:::::" + newgame_);
      });
    };

    await newSchedule
      .save()
      .then()
      .catch((err) => {
        res.status(500).json("Internal Server Error");
      });

    scheduleNewJob(
      date[0],
      parseInt(date[1]) - 1,
      date[2],
      time[0],
      time[1],
      amorpm,
      newSchedule._id,
      user
    );
    res.status(200).json("Scheduled successfully!!");
  }
);

router.get("/purchase/game/:id", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const game = await Game.findOne({
    _id: req.params.id,
  });
  if (!game) return res.json("Internal Server Error");

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:5000/proxy/payment/${game._id}/success`,
      cancel_url: "http://localhost:5000/proxy/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: game.name,
              sku: "item",
              price: game.price,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: game.price,
        },
        description: `purchase of ${game.name}`,
      },
    ],
  };
  await paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      return res.json({
        link: "http://localhost:3000/paymenterror",
      });
    }
    for (let i = 0; i < payment.links.length; i++) {
      if (payment.links[i].rel === "approval_url") {
        let response = {
          link: payment.links[i].href,
        };
        res.json(response);
      }
    }
  });
});

router.get("/payment/:id/success", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const game = await Game.findOne({
    _id: req.params.id,
  });
  if (!game) return res.json("Internal Server Error");

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: game.price,
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      res.status(500).json("Internal Server Error");
    } else {
      console.log("Get Payment Response");
      console.log(JSON.stringify(payment));
    }
  });

  user.purchasedGames.push(game._id);
  game.purchasedUsers.push(user._id);

  const profitUser = await User.findOne({
    username: game.creator,
  });

  profitUser.upcomingPayments += parseInt(game.price);
  console.log("reached herrreeeeee");

  await profitUser
    .save()
    .then()
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });

  await game
    .save()
    .then()
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
  await user
    .save()
    .then()
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
  res.redirect("http://localhost:3000/myprofile");
});

router.get("/schedules", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");
  const schedules = await Schedule.find();
  console.log(schedules);
  res.json(schedules);
});

// profile pic

router.post(
  "/me/profilepic/upload",
  formidable({
    encoding: "utf-8",
    uploadDir: "./uploads/profilepic",
    multiples: false,
  }),
  jwtVerification,
  async (req, res) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    if (!user) return res.json("Internal Server Error");

    console.log(req.files);
    const filename = req.files.image.path.match(/(\upload_.*)/g).toString();
    let extension;

      if (req.files.type === "image/jpeg") {
        extension = "jpeg";
      } else if (req.files.type === "image/png") {
        extension = "png";
      } else {
        extension ="jpg";
      }
      fs.renameSync(
        `./uploads/profilepic/${filename}`,
        `./uploads/profilepic/${filename}.${extension}`
      );
      const newfilename = filename + '.' + extension;
      user.profilepic = newfilename;
      await user.save().then(() => {
        return res.status(200).json({
          filename: newfilename 
        });
      }).catch(err => {
        return res.status(500).json('Internal Server Error');
      });
  }
);

// about me ----------------------------------------

router.post("/me/aboutme/update", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    username: req.user.username,
  });
  if (!user) return res.status(403);

  const aboutme = req.body.aboutme;
  console.log('body: ' + req.body.aboutme);

  user.aboutme = aboutme;
  await user
    .save()
    .then(() => {
      return res.json({aboutme: aboutme});
    })
    .catch((err) => {
      return res.status(500).json('Internal Server Error');
    });
});


//game create routes

router.post(
  "/create/game",
  formidable({
    encoding: "utf-8",
    uploadDir: "./uploads/games/zips",
    multiples: false,
  }),
  jwtVerification,
  async (req, res) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    if (!user) return res.json("Internal Server Error");

    const filename = req.files.files.path.match(/(\upload_.*)/g).toString();
    let newfilename;
    if (!req.fields.fee || req.fields.fee === "0") {
      req.fields.fee = "Free";
    }

    if (req.files.files.type === "application/x-zip-compressed") {
      newfilename = filename + ".zip";
    } else {
      newfilename = filename + ".rar";
    }
    fs.renameSync(
      `./uploads/games/zips/${filename}`,
      `./uploads/games/zips/${newfilename}`
    );
    console.log("filename" + newfilename);
    console.log(req.files.files.type);

    console.log(req.fields);

    const newGame = new Game({
      name: req.fields.name,
      gameFile: newfilename,
      longdescription: req.fields.ldesc,
      description: req.fields.sdesc,
      creator: user.username,
      category: req.fields.category,
      platform: req.fields.platform,
      price: req.fields.fee,
      imageURL: req.fields.imgurl,
      hostURL: req.fields.hosturl,
    });

    await user.createdGames.push(newGame._id);
    user.noOfCreatedGames += 1;
    console.log(newGame);
    await user.save().then().catch();
    await newGame
      .save()
      .then((doc) => {
        res.json("Success");
      })
      .catch((err) => {
        return res.status(500).json("Internal Server Error");
      });
    unzipRar(`./uploads/games/zips/${newfilename}`, newGame._id);
  }
);

router.post(
  "/teaser/upload/new",
  formidable({
    encoding: "utf-8",
    uploadDir: "./uploads/games/files",
    multiples: true,
  }),
  jwtVerification,
  async (req, res) => {
    const user = await User.findOne({
      email: req.user.email,
    });
    console.log(req.fields);
    console.log(req.files);
    if (!user) return res.json("Internal Server Error");
    if (req.fields.fileCount === 0 || !req.files.video) {
      return res.status(500).json("No files uploaded!!!");
    }
    console.log(req.fields);
    let filename = [];
    let extensions = [];
    for (let i = 0; i < req.files.files.length; i++) {
      filename.push(req.files.files[i].path.match(/(\upload_.*)/g).toString());
      if (req.files.files[i].type === "image/jpeg") {
        extensions.push(".jpeg");
      } else if (req.files.files[i].type === "image/png") {
        extensions.push(".png");
      } else {
        extensions.push(".jpg");
      }
      fs.renameSync(
        `./uploads/games/files/${filename[i]}`,
        `./uploads/games/files/${filename[i]}${extensions[i]}`
      );
    }

    for (let i = 0; i < filename.length; i++) {
      filename[i] = filename[i] + extensions[i];
    }

    const videoname = req.files.video.path.match(/(\upload_.*)/g).toString();

    let videoExtension = "";
    if (req.files.video.type === "video/x-matroska") {
      videoExtension = "mkv";
    } else {
      videoExtension = "mp4";
    }
    const newvideoname = videoname + '.'+ videoExtension;

    console.log(newvideoname);
    console.log(filename);
    fs.renameSync(
      `./uploads/games/files/${videoname}`,
      `./uploads/games/files/${newvideoname}`
    );

    const newteaser = new Teaser({
      name: req.fields.name,
      releaseDate: req.fields.release,
      description: req.fields.desc,
      creator: user.username,
      category: req.fields.category,
      platform: req.fields.platform,
      images: filename,
      price: req.fields.fee,
      video: newvideoname,
      coverimageurl: req.fields.img,
      videoExtension: videoExtension
    });
    console.log(newteaser);

    await newteaser
      .save()
      .then()
      .catch((err) => {
        res.json("Internal Server Error");
      });

    const date = req.fields.release.split("-");
    console.log(date);

    const scheduleTeaserDelete = async (year, month, day, id) => {
      console.log(year + "  " + month + "  " + day + "  " + id);
      const scheduledate = new Date(year, month, day, 17, 50, 1);
      console.log(scheduledate);
      let j = schedule.scheduleJob(scheduledate, async function () {
        await Teaser.deleteOne({ _id: id }, (err) => {
          if (err) {
            console.log("Scheduled delete error");
          }
          console.log("teaser deleted successfully");
        });
      });
    };

    scheduleTeaserDelete(date[0], date[1] - 1, date[2], newteaser._id);

    res.json("OK");
  }
);

router.get("/teasers", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.status(500).json("Internal Server Error");

  const teaser = await Teaser.find();
  console.log(teaser);

  res.status(200).json(teaser);
});

router.get("/teaser/:id", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.status(500).json("Internal Server Error");

  const teaser = await Teaser.findOne({
    _id: req.params.id,
  });
  console.log(teaser);

  res.status(200).json(teaser);
});
/**           COMMENT ROUTES  START        **/

router.post("/game/:gameid/makecomment", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    username: req.user.username,
  });
  if (!user) return res.json({ message: "a" });

  const game = await Game.findOne({
    _id: req.params.gameid,
  });
  if (!game) return res.json({ message: "b" });

  console.log(user.username);
  const newComment = await new Comment({
    comment: req.body.comment,
    commentBy: user.username,
    game: game._id,
  });

  console.log(newComment);
  await newComment
    .save()
    .then((doc) => {
      console.log("doc::::" + doc);
    })
    .catch((err) => {});

  game.comments.push(newComment._id);
  user.comments.push(newComment._id);
  await game
    .save()
    .then()
    .catch((err) => {});
  await user
    .save()
    .then(() => {
      return res.json("OK");
    })
    .catch((err) => {});
});

router.get("/game/:id/comments", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    username: req.user.username,
  });
  console.log(user);
  if (!user) return res.json({ message: "User does not exist" });
  const game = await Game.findOne({
    _id: req.params.id,
  });
  if (!game) return res.json({ message: "User does not exist" });
  const gamecommentids = game.comments;
  const final = await Comment.find({ _id: { $in: gamecommentids } });
  console.log(final);
  res.status(200).json(final);
});

router.get(
  "/game/:id/removecomment/:commentid",
  jwtVerification,
  async (req, res) => {
    const user = await User.findOne({
      username: req.user.username,
    });
    if (!user) return res.json({ message: "User does not exist1" });

    if (!user.comments.includes(req.params.commentid)) {
      return res.json({ message: "User does not have right to delete" });
    }

    const game = await Game.findOne({
      _id: req.params.id,
    });
    if (!game) return res.json({ message: "User does not exist2" });

    const comment = await Comment.findOne({
      _id: req.params.commentid,
    });
    if (!comment) return res.json({ message: "User does not exist3" });
    user.comments.pull(req.params.commentid);
    game.comments.pull(req.params.commentid);

    await user
      .save()
      .then()
      .catch((err) => {});
    await game
      .save()
      .then((doc) => {
        res.json("OK");
      })
      .catch((err) => {
        return res.status(500).json("Internal Server Error");
      });
  }
);

/**           COMMENT ROUTES  END        **/

router.get("/profile/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({
    username: username,
  });
  if (!user) return res.json({ message: "User does not exist" });

  res.status(200).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    aboutme: user.aboutme,
    profilepic: user.profilepic,
    createdGames: user.createdGames,
    favouriteGames: user.favouriteGames,
    noOfCreatedGames: user.noOfCreatedGames,
    rating: user.rating,
    signal: user.signal,
    popularity: user.popularity,
  });
});

router.get("/game/:id/view", async (req, res) => {
  try {
    const gameid = req.params.id;
    const game = await Game.findOne({
      _id: gameid,
    });
    if (!game) return res.json("Internal Server Error");

    res.json(game);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/trending", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const game = await Game.find()
    .sort({
      downloads: -1,
    })
    .limit(10);
  res.status(200).json(game);
});

router.get("/mostfavourites", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const game = await Game.find()
    .sort({
      favourites: -1,
    })
    .limit(10);
  res.status(200).json(game);
});

router.get("/allgames", async (req, res) => {
  try {
    const game = await Game.find();
    if (!game) return res.json("Internal Server Error");
    console.log(game);
    res.json(game);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/mycreatedgames", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  try {
    const games = await user.createdGames;
    if (!games) return res.json("User has not created any games yet.");
    const final = await Game.find({ _id: { $in: games } });
    res.json(final);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/:author/createdgames", async (req, res) => {
  try {
    const doc = await Game.find({
      creator: req.params.author,
    });
    //const games = await user.createdGames;
    //if (!doc) return res.json('User has not created any games yet.');
    //const final = await Game.find({_id: {$in : games}})
    res.json(doc);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/:author/favouritegames", async (req, res) => {
  try {
    const doc = await User.findOne({
      username: req.params.author,
    });
    const games = doc.favouriteGames;
    if (!games) return res.json("No Favourites");
    const final = await Game.find({ _id: { $in: games } });
    res.json(final);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

router.get("/download/:id", jwtVerification, async (req, res) => {
  const game = await Game.findOne({
    _id: req.params.id,
  });
  if (!game) return res.status(500).json("Internal Server Error");
  game.downloads += 1;
  (await game)
    .save()
    .then()
    .catch((err) => {
      return res.status(500).json("Internal Server Error");
    });
  console.log(game);

  const file = path
    .join(__dirname, `../uploads/games/zips/${game.gameFile}`)
    .toString();
  res.download(file);
});

router.get("/myfavouritegames", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  try {
    const games = await user.favouriteGames;
    if (!games) return res.json("No Favourites");
    const final = await Game.find({ _id: { $in: games } });
    res.json(final);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/:id/makefavourite", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const gameid = req.params.id;

  const game = await Game.findOne({
    _id: gameid,
  });
  if (!game) return res.json("Internal Server Error");

  try {
    if (!gameid) return res.json("Internal Server Error");
    if (!user.favouriteGames.includes(gameid)) {
      user.favouriteGames.push(gameid);
      game.favourites += 1;
      await game
        .save()
        .then()
        .catch((err) => {
          return res.json("Internal Server Error");
        });
      await user
        .save()
        .then((doc) => {
          return res.json("Added to Favourites");
        })
        .catch((err) => {
          return res.json("Internal Server Error");
        });
    } else {
      return res.json("Already in favourites");
    }
  } catch (error) {
    return res.json("Internal Server Error");
  }
});

router.get("/:id/removefavourite", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const gameid = req.params.id;

  const game = await Game.findOne({
    _id: gameid,
  });
  if (!game) return res.json("Internal Server Error");

  try {
    if (!gameid) return res.json("Internal Server Error");
    if (user.favouriteGames.includes(gameid)) {
      user.favouriteGames.pull(gameid);
      game.favourites -= 1;
      await game
        .save()
        .then()
        .catch((err) => {
          return res.json("Internal Server Error");
        });
      await user
        .save()
        .then((doc) => {
          res.json("Removed from favourites.");
        })
        .catch((err) => {
          res.json("Internal Server Error");
        });
    } else {
      res.json("Already not a favourite.");
    }
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/myLikedGames", jwtVerification, async (re, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  try {
    res.status(200).json(user.likedGames);
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/:id/like", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");
  try {
    const gameid = req.params.id;
    const game = await Game.findOne({
      _id: gameid,
    });
    if (!game) return res.json("Internal Server Error");
    if (game.likedPeoples.includes(user._id)) {
      return res.json("Cannot like more than Once").status(403);
    }
    if (game.dislikedPeoples.includes(user._id)) {
      game.dislikedPeoples.remove(user._id);
      game.dislikes -= 1;
    }
    game.likes += 1;
    game.likedPeoples.push(user._id);
    await game
      .save()
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.json("Internal Server Error");
      });
  } catch (error) {
    res.json("Internal Server Error");
  }
});

router.get("/:id/dislike", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");
  try {
    const gameid = req.params.id;
    const game = await Game.findOne({
      _id: gameid,
    });
    if (!game) return res.json("Internal Server Error");
    if (game.dislikedPeoples.includes(user._id)) {
      return res.json("Cannot dislike more than once.");
    }
    if (game.likedPeoples.includes(user._id)) {
      game.likedPeoples.remove(user._id);
      game.likes -= 1;
    }
    game.dislikes += 1;
    game.dislikedPeoples.push(user._id);
    await game
      .save()
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.json("Internal Server Error");
      });
  } catch (error) {
    res.json("Internal Server Error");
  }
});

module.exports = router;

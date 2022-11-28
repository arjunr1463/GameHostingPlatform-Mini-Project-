const router = require("express").Router();
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const { registerValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const jwtVerification = require("./jwtVerification");

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  const isValid = registerValidation(req.body);
  if (isValid.error)
    return res.status(403).json(isValid.error.details[0].message);

  const emailExists = await User.findOne({
    email: email,
  });
  if (emailExists) return res.status(403).json("Email already exists");

  const usernameExists = await User.findOne({
    username: username,
  });
  if (usernameExists) return res.status(403).json("Username already exists");

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: email,
    username: username,
    password: req.body.password,
  });

  await user
    .save()
    .then(async (doc) => {
      await jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) return res.status(500).json("Internal Server Error");
          res.status(200).json({
            accessToken: token,
            expiresIn: "1h",
            tokenType: "Bearer",
          });
        }
      );
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
});

/**router.get("/profile/:author", jwtVerification, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  if (!user) return res.json("Internal Server Error");

  const doc = await User.findOne({
    username: req.params.author,
  });
  res.json({
    _id: doc._id,
    email: doc.email,
    username: doc.username,
    createdGames: doc.createdGames,
    favouriteGames: doc.favouriteGames,
    purchasedGames: doc.purchasedGames,
    upcomingPayments: doc.upcomingPayments,
    noOfCreatedGames: doc.noOfCreatedGames,
    rating: doc.rating,
    signal: doc.signal,
    popularity: doc.popularity,
  });
});**/

router.get("/me", jwtVerification, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    });
    if (!user) return res.json("Internal Server Error");
    console.log(user);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      aboutme: user.aboutme,
      profilepic: user.profilepic,
      createdGames: user.createdGames,
      purchasedGames: user.purchasedGames,
      upcomingPayments: user.upcomingPayments,
      comments: user.comments,
      favouriteGames: user.favouriteGames,
      noOfCreatedGames: user.noOfCreatedGames,
      rating: user.rating,
      signal: user.signal,
      popularity: user.popularity,
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
  });
  if (!user) return res.status(403).json("Email/Password does not exists");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) return res.status(403).json("Incorrect Password");

  await jwt.sign(
    {
      userId: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    (err, token) => {
      if (err) return res.status(500).json("Internal Server Error");
      res.status(200).json({
        accessToken: token,
        expiresIn: "1h",
        tokenType: "Bearer",
      });
    }
  );
});

router.post("/forgotpwd", async (req, res) => {
  console.log(req.body.email);
  if (!req.body.email)
    return res.status(400).json("No Email Parameter Passed");

  const user = await User.findOne({
    email: req.body.email,
  });
  console.log(user);

  if (!user) return res.status(500).json("No user exists with that email");

  const email = req.body.email;
  const token = uuidv4();

  async function main() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'gunner.mccullough@ethereal.email',
          pass: 'eqnfBqf7TyVJjt4jdF'
      }
  });

    let info = await transporter.sendMail({
      from: "gunner.mccullough@ethereal.email",
      to: `${req.body.email}`,
      subject: "Password reset",
      text: "Password Reset Email - Design Project",
      html: `<b>Token: http://localhost:3000/pswdreset/${token}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    user.pwdResetToken = token;
    user.password = "null";
    user
      .save()
      .then((doc) => {
        return res.status(200).json(`Password Reset Email sent to ${email}`);
      })
      .catch((err) => {
      });
  }

  main().catch(res.json("Internal Server Error"));
});

router.post("/reset/:token", async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({
    pwdResetToken: token,
  });
  if (!user) return res.status(403).json("Token Expired");

  req.body.password = await bcrypt.hash(req.body.password, 15);

  user.password = req.body.password;
  user.pwdResetToken = null;

  user
    .save()
    .then((doc) => {
      res.status(200).json("Password Reset Successfull");
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
});

module.exports = router;

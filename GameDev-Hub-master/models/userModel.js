const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  aboutme: {
    type: String
  },
  profilepic: {
    type: String
  },
  username: {
    type: String,
    required: true,
    min: 4,
  },
  pwdResetToken: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  popularity: {
    type: Number,
  },
  signal: {
    type: Number,
  },
  noOfCreatedGames: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
  },
  createdGames: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Game",
    },
  ],
  favouriteGames: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Game",
    },
  ],
  likedGames: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Games",
    },
  ],
  purchasedGames: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Games",
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  upcomingPayments: [
    {
      type: String,
      default: 0,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

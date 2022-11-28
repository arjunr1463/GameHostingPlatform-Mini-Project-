const mongoose = require("mongoose");

const scheduleModel = mongoose.Schema({
  release: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 200,
  },
  longdescription: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  favourites: {
    type: Number,
    default: 0,
  },
  category: [
    {
      type: String,
      default: "Not Specified",
    },
  ],
  platform: [
    {
      type: String,
      default: "Not Specified",
    },
  ],
  downloads: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  likedPeoples: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikedPeoples: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  imageURL: {
    type: String,
    required: true,
  },
  hostURL: {
    type: String,
  },
  gameFile: {
    type: String,
  },
  price: {
    type: String,
    default: "Free",
  },
  editorsChocie: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleModel);

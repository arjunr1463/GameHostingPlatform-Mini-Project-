const mongoose = require("mongoose");

const teaserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
  },
  description: {
    type: String,
    required: true,
    max: 300,
  },
  creator: {
    type: String,
  },
  likes: {
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
  video: {
    type: String,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: String,
    default: "Free",
  },
  editorsChocie: {
    type: Boolean,
    default: false,
  },
  coverimageurl: {
    type: String,
    required: true,
  },
  videoExtension: {
    type: String
  }
});

module.exports = mongoose.model("Teaser", teaserSchema);

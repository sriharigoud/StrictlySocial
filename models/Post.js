const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    default:''
    // required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  imageName: {
    type: String,
    default: "none"
  },
  imageData: {
    type: String
  },
  linkData: {
    type: Object,
    default: {}
  }
});

module.exports = Posts = mongoose.model("post", PostSchema);

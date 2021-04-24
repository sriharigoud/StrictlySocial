const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken:{
    type: String,
    required: false,
    default: "",
  },
  resetPasswordExpires:{
    type: String,
    required: false,
    default: "",
  },
  imageName: {
    type: String,
    default: "none"
  },
  imageData: {
    type: String
  }
});

module.exports = User = mongoose.model("user", UserSchema);

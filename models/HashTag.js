const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HashTagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = HashTag = mongoose.model(
  "hashtag",
  HashTagSchema
);

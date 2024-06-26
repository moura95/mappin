const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
    },
    ratting: {
      type: Number,
      require: true,
      min: 0,
      max: 5,
    },
    latitude: {
      type: Number,
      require: true,
    },
    longtide: {
      type: Number,
      require: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    fullName: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
    password: {
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

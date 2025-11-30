const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Connected TO DB");
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB

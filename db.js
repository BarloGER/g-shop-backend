const mongoose = require("mongoose");

const db = async (req, res) => {
  try {
    const URI = process.env.MONGO_URI;
    // Set strictQuery, true to prepare for chances comming with moongose 7
    mongoose.set("strictQuery", true);
    // With true only fields defined in the Schemas will be saved to DB
    // False will save everything
    mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Could not connect to DB");
  }
};

module.exports = db;

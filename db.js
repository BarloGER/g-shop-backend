import mongoose from "mongoose";

const connectToDB = async (req, res) => {
  try {
    const URI = process.env.MONGO_URI;
    // Set strictQuery, true to prepare for mongoose v7 changes
    mongoose.set("strictQuery", true);
    mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

export default connectToDB;

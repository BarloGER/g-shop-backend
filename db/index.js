import mongoose from "mongoose";

// Connect to MongoDB
const env = process.env.NODE_ENV;
console.log(env + " environment");
if (env === "development") {
  try {
    // Set strictQuery, true to prepare for mongoose v7 changes
    mongoose.set("strictQuery", true);
    const client = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB @ ${client.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

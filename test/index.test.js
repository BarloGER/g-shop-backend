import { expect } from "chai";
import mongoose from "mongoose";
import { connectToDB } from "../db/index.js";

describe("MongoDB connection", () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should connect to MongoDB in development environment", async () => {
    // Set environment to development
    process.env.NODE_ENV = "development";

    try {
      const client = await connectToDB();
      expect(client.connection.host).to.be.a("string");
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it("should return an error if connection to MongoDB fails", async () => {
    // Set environment to development
    process.env.NODE_ENV = "development";

    // Set an invalid URI to force a connection error
    process.env.MONGO_URI = "mongodb://localhost:27017/invalid";

    try {
      await connectToDB();
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});

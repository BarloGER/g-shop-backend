import { expect } from "chai";
import mongoose from "mongoose";

describe("DB Connection", () => {
  process.env.NODE_ENV = "development";

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should connect to the database if Node_ENV = development", async () => {
    if (process.env.NODE_ENV === "development") {
      mongoose.set("strictQuery", true);
      await mongoose.connect(process.env.MONGO_URI);
      expect(mongoose.connection.readyState).to.equal(1);
    }
  });

  it("should throw an error if MONGO_URI is not set and NODE_ENV = development", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.MONGO_URI;
    try {
      await mongoose.connect(process.env.MONGO_URI);
      expect(mongoose.connection.readyState).to.equal(0);
    } catch (err) {
      expect(err).to.exist;
      return;
    }
  });

  it("should fail the database connection with invalid connection string", async () => {
    process.env.NODE_ENV = "development";
    try {
      await mongoose.connect("invalid_connection_string");
      expect(mongoose.connection.readyState).to.equal(0);
    } catch (err) {
      expect(err).to.exist;
      return;
    }
  });

  it("should fail the database connection with invalid login data", async () => {
    process.env.NODE_ENV = "development";
    try {
      await mongoose.connect(process.env.MONGO_URI_TEST);
      expect(mongoose.connection.readyState).to.equal(0);
    } catch (err) {
      expect(err).to.exist;
      return;
    }
  });
});

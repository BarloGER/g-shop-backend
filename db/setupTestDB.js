import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

const connectTestDB = async () => {
  // Set strictQuery, true to prepare for mongoose v7 changes
  mongoose.set("strictQuery", true);
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

const disconnectTestDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

const dropTestCollections = async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
};

export { connectTestDB, disconnectTestDB, dropTestCollections };

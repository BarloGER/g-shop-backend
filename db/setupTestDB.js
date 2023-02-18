import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

const connectTestDB = async () => {
  // Set strictQuery, true to prepare for mongoose v7 changes
  mongoose.set("strictQuery", true);
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const client = await mongoose.connect(uri);
  console.log(`Connected to MongoDB @ ${client.connection.host}`);
};

const dropTestDB = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

const dropTestCollections = async () => {
  if (mongod) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany();
    }
  }
};

export { connectTestDB, dropTestDB, dropTestCollections };

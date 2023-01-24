import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Connection to DB
db();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

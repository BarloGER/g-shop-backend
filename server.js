import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import "./db/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

// ----- Will allow requests from every origin ----- //
app.use(cors({ origin: "*" }));

// ----- Parse incoming requests with JSON payload ----- //
app.use(express.json());

// ----- Parse incoming requests with URL-encoded payload ----- //
app.use(express.urlencoded());

// ----- Router ----- //
app.use("/auth", authRouter);

// ----- If previous routes dont match request, sends 404 ----- //
app.use("*", (req, res) => res.sendStatus(404));

// ----- Sends err message to client ----- //
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { connectToDB } from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectToDB();

// Will allow requests from every origin
app.use(cors({ origin: "*" }));

// Parse incoming requests with JSON payload
app.use(express.json());

// Parse incoming requests with URL-encoded payload
app.use(express.urlencoded());

// Route for authentication (signup, signin, get user profile)
app.use("/auth", authRouter);

// Route for non-existing routes
app.use("*", (req, res) => res.sendStatus(404));

// Sends errors to client
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;

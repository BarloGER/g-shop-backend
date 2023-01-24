import express from "express";

// Controllers
import getAllUsers from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.route("/").get(getAllUsers).post();

usersRouter.route("/:id").get().put().delete();

export default usersRouter;

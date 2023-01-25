import express from "express";
// import jwtTokenVerify from "../middleware/auth.js";

// Controllers
import crudFunc from "../controllers/users.js";

const usersRouter = express.Router();

// ----- Route for getting all users and creating a new user ----- //
usersRouter.route("/").get(crudFunc.getAllUsers).post(crudFunc.createUser);

// ----- Route for getting, updating or deleting a single user by ID ----- //
usersRouter.route("/:id").get().put().delete();

// ----- Route for logging in a user ----- //
usersRouter.route("/login").post(crudFunc.handleLogin);

// ----- Route for checking user authentication ----- //
// usersRouter.route("/checkAuth").get(jwtTokenVerify, crudFunc.getSingleUser);

export default usersRouter;

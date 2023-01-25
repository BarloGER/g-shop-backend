import express from "express";
import jwtToken from "../middleware/auth.js";

// Controllers
import crudFunctions from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(crudFunctions.getAllUsers)
  .post(crudFunctions.createUser);

usersRouter.route("/:id").get().put().delete();
usersRouter.route("/checkAuth").get(jwtToken, crudFunctions.getSingleUser);
usersRouter.route("/login").post(crudFunctions.loginUser);
export default usersRouter;

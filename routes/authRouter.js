import { Router } from "express";
import { getUser, signIn, signUp, deleteUser } from "../controllers/auth.js";
import { signInSchema, userSchema } from "../joi/schemas.js";
import validateJOI from "../middlewares/validateJOI.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

// Route for SignUp (with JOI validation)
authRouter.post("/signup", validateJOI(userSchema), signUp);

// Route for SignIn (with JOI validation)
authRouter.post("/signin", validateJOI(signInSchema), signIn);

// Route for user profile (with JWT verification)
authRouter.get("/me", verifyToken, getUser);

// Route for deleting user (with JWT verification)
authRouter.delete("/me", verifyToken, deleteUser);

export default authRouter;

import { Router } from "express";
import validateJOI from "../middlewares/validateJOI.js";
import { getUser, signIn, signUp } from "../controllers/auth.js";
import { siginSchema, userSchema } from "../joi/schemas.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

// Route for SignUp (with JOI validation)
authRouter.post("/signup", validateJOI(userSchema), signUp);

// Route for SignIn (with JOI validation)
authRouter.post("/signin", validateJOI(siginSchema), signIn);

// Route for user profile (with JWT verification)
authRouter.get("/me", verifyToken, getUser);

export default authRouter;

import { Router } from "express";
import validateJOI from "../middlewares/validateJOI.js";
import { getUser, signIn, signUp } from "../controllers/auth.js";
import { siginSchema, userSchema } from "../joi/schemas.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

// ----- Route for SignUp ----- //
authRouter.post("/signup", validateJOI(userSchema), signUp);

// ----- Route for SignIn ----- //
authRouter.post("/signin", validateJOI(siginSchema), signIn);

// ----- Route for user profile ----- //
authRouter.get("/me", verifyToken, getUser);

export default authRouter;

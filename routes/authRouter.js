import { Router } from "express";
import validateJOI from "../middlewares/validateJOI.js";
import { getUser, signIn, signUp } from "../controllers/auth.js";
import { siginSchema, userSchema } from "../joi/schemas.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

authRouter.post("/signup", validateJOI(userSchema), signUp);
authRouter.post("/signin", validateJOI(siginSchema), signIn);
authRouter.get("/me", verifyToken, getUser);

export default authRouter;

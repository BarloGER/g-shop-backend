import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  if (!authorization) throw new ErrorResponse("Bitte zuerst einloggen", 401);
  const { _id } = jwt.verify(authorization, process.env.SECRET_KEY);
  req.userId = _id;
  next();
});

export default verifyToken;

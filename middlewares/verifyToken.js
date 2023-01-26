import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// ----- Verifies if a user is authenticated, before allowing them to access certain routes ----- //
const verifyToken = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  if (!authorization)
    throw new ErrorResponse({
      message: "Bitte zuerst einloggen.",
      statusCode: 401,
      errorType: "Unauthorized",
      errorCode: "AUTH_004",
    });
  const { _id } = jwt.verify(authorization, process.env.SECRET_KEY);
  req.userId = _id;
  next();
});

export default verifyToken;

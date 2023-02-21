import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// ? Maybe switch arrow function to function keyword

// This function is called when the user signs up
export const signUp = asyncHandler(async (req, res, next) => {
  const {
    body: { email, password, ...rest },
  } = req;
  const found = await User.findOne({ email });
  if (found)
    throw new ErrorResponse({
      message: "E-Mail existiert bereits",
      statusCode: 403,
      errorType: "Validation Error",
      errorCode: "AUTH_001",
    });
  const hash = await bcrypt.hash(password, 5);
  const { _id } = await User.create({ ...rest, email, password: hash });
  const token = jwt.sign({ _id }, process.env.SECRET_KEY);
  res.status(201).json({ token });
});
//--------------------------------------------------------------

// This function is called when the user signs in
export const signIn = asyncHandler(async (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  const found = await User.findOne({ email }).select("+password");
  if (!found)
    throw new ErrorResponse({
      message: `Es ist kein User mit dieser E-Mail registriert.`,
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "AUTH_002",
    });
  const match = await bcrypt.compare(password, found.password);
  if (!match)
    throw new ErrorResponse({
      message: `Falsches Passwort`,
      statusCode: 401,
      errorType: "Unauthorized",
      errorCode: "AUTH_003",
    });
  const token = jwt.sign({ _id: found._id }, process.env.SECRET_KEY);
  res.status(201).json({ token });
});
//--------------------------------------------------------------

// This function is called when the user wants to get his data from the DB (e.g. for the profile page)
export const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const user = await User.findById(userId).select("-password");
  res.status(200).json(user);
});
//--------------------------------------------------------------

// This function is called to delete the user from the DB
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse({
      message: `User mit id ${userId} nicht gefunden.`,
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "AUTH_004",
    });
  }
  await user.remove();
  res.status(200).json({ message: "User erfolgreich gelöscht." });
});

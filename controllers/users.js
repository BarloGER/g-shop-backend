import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ? Maybe switch arrow function to function keyword
// ? Maybe implement email in token

//  ----- Get all users from DB ----- //
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ----- Get a single user from DB -----//
const getSingleUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) return res.send("Nutzer nicht gefunden.");
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ----- Create a user in DB ----- //
const createUser = async (req, res) => {
  const {
    salutation,
    firstname,
    lastname,
    birth_date,
    email,
    password,
    zip_code,
    city,
    street,
    street_number,
    country,
    tel,
  } = req.body;
  console.log(req.body);
  try {
    // If email is already registered, send status code 422.
    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered)
      return res.status(422).send("Email bereits registriert.");
    // Hashes password with a salt of 5.
    const hash = await bcrypt.hash(password, 5);
    // Create user with hashed password in DB
    const { _id } = await User.create({
      salutation,
      firstname,
      lastname,
      birth_date,
      email,
      password: hash,
      zip_code,
      city,
      street,
      street_number,
      country,
      tel,
    });
    // Create new JWT and send id in payload, expires after (x) time.
    const newToken = jwt.sign({ _id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res.status(200).json(newToken);
  } catch (err) {
    res
      .status(500)
      .send("Hier ist ein Fehler aufgetreten, bitte wende dich an den Support");
  }
};

// ----- Handles Login ----- //
const handleLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.send("Bitte zuerst registrieren");
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.send("passwort ist falsch");
    const newToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    return res.status(200).json(newToken);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const crudFunc = {
  getAllUsers,
  createUser,
  getSingleUser,
  handleLogin,
};

export default crudFunc;

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ? Maybe switch arrow function to function keyword
// ? Maybe implement email in token

//  Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

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
  // If user is found per email in the DB, it will tell the user to put in another email
  try {
    const found = await User.findOne({ email });
    if (found)
      return res
        .status(400)
        .send("Email bereits vorhanden, bitte eine andere angeben");
    // Hashes pw 5 times
    const hash = await bcrypt.hash(password, 5);
    // Send the user with hashed pw into the DB
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
    // Creates JWT and send data into the payload
    const token = jwt.sign({ _id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res.status(200).json(token);
  } catch (err) {
    res
      .status(500)
      .send("Hier ist ein Fehler aufgetreten, bitte wende dich an den Support");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.send("Bitte zuerst registrieren");
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.send("passwort ist falsch");
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    return res.status(200).json(token);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const crudFunctions = {
  getAllUsers,
  createUser,
  getSingleUser,
  loginUser,
};

export default crudFunctions;

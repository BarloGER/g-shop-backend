import { Schema, model } from "mongoose";

// Checks SignUp data after Joi validation and passes it to the DB if valid

// Schema for SignUp
const userSchema = new Schema({
  salutation: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birth_date: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  zip_code: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  street_number: { type: String, required: true },
  country: { type: String, required: true },
  tel: { type: String, required: false },
});

export default model("User", userSchema);

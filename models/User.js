import { Schema, model } from "mongoose";

const userSchema = new Schema({
  salutation: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birt_date: { type: String, requires: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  zip_code: { type: Number, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  street_number: { type: String, required: true },
  country: { type: String, required: true },
  tel: { type: String, required: false },
});

export default model("User", userSchema);

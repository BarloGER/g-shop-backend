import mongoose, { Schema } from "mongoose";

// For new customer form
const User = new Schema({
  salutation: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birt_date: { type: String, requires: true },
  zip_code: { type: Number, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  nr: { type: String, required: true },
  country: { type: String, required: true },
  tel: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const model = mongoose.model("users", User);

export const schema = model.schema;
export default model;

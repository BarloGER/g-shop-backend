import Joi from "joi";

// ----- Validate user data on SignUp ----- //
export const userSchema = Joi.object({
  salutation: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  birth_date: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().alphanum().min(8).max(12).required(),
  zip_code: Joi.number().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  street_number: Joi.string().required(),
  country: Joi.string().required(),
  tel: Joi.string(),
});

// ----- Validate user data on SignIn ----- //
export const siginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

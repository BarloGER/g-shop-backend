import Joi from "joi";

export const userSchema = Joi.object({
  salutation: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birt_date: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().alphanum().min(8).max(12).required(),
  zip_code: Joi.number.required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  street_number: Joi.string().required(),
  country: Joi.string().required(),
  tel: Joi.string().required(),
});

import Joi from "joi";

//ToDo: Fix birth_date validation
//ToDo: street_number min 1?
//ToDo: Improve password validation for saver passwords

// Checks data from frontend and returns error message to use in frontend if data is invalid

// Checks SignUp data
export const userSchema = Joi.object({
  salutation: Joi.string()
    .required()
    .messages({ "string.empty": "Anrede muss angegeben werden" }),
  firstname: Joi.string()
    .regex(/^[A-ZÄÖÜa-zäöüß\u00C0-\u00FF]*$/)
    .required()
    .messages({
      "string.pattern.base": "Der Vorname darf nur aus Buchstaben bestehen",
      "string.empty": "Der Vorname muss angegeben werden",
    }),
  lastname: Joi.string()
    .regex(/^[A-ZÄÖÜa-zäöüß\u00C0-\u00FF]*$/)
    .required()
    .messages({
      "string.pattern.base": "Der Nachname darf nur aus Buchstaben bestehen",
      "string.empty": "Der Nachname muss angegeben werden",
    }),
  birth_date: Joi.date().less("now").required().messages({
    "date.base": "Das Geburtsdatum muss angegeben werden",
    "date.less": "Das Geburtsdatum darf nicht in der Zukunft liegen",
    "date.empty": "Das Geburtsdatum muss angegeben werden",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "de", "net"] } })
    .required()
    .messages({
      "string.email": "Die E-Mail muss mit .com, .de oder .net enden",
      "string.empty": "Die E-Mail muss angegeben werden",
    }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.min": "Passwort muss mindestens {#limit} Zeichen lang sein",
    "string.max": "Passwort darf höchstens {#limit} Zeichen lang sein",
    "string.empty": "Passwort muss angegeben werden",
  }),
  zip_code: Joi.string().regex(/^\d+$/).min(4).max(5).required().messages({
    "string.empty": "Die Postleitzahl muss angegeben werden",
    "string.pattern.base": "Die Postleitzahl darf nur Nummern enthalten",
    "string.min": "Die Postleitzahl muss mindestens {#limit} Zeichen lang sein",
    "string.max": "Die Postleitzahl darf höchstens {#limit} Zeichen lang sein",
  }),
  city: Joi.string()
    .regex(/^[A-ZÄÖÜßa-zäöüß]*$/)
    .required()
    .messages({
      "string.empty": "Die Stadt muss angegeben werden",
      "string.pattern.base": "Die Stadt darf nur aus Buchstaben bestehen",
    }),
  street: Joi.string()
    .regex(/^[a-zA-ZÖÜÄöüß\s.-]+$/)
    .required()
    .messages({
      "string.empty": "Die Straße muss angegeben werden",
      "string.pattern.base":
        "Die Straße darf nur aus Buchstaben, Leerzeichen oder Bindestrich bestehen",
    }),
  street_number: Joi.string()
    .regex(/^[0-9a-zA-Z]+$/)
    .min(1)
    .max(5)
    .required()
    .messages({
      "string.empty": "Die Hausnummer muss angegeben werden",
      "string.pattern.base":
        "Die Hausnummer darf nur aus Buchstaben und Zahlen bestehen",
      "string.min": "Die Hausnummer muss mindestens {#limit} Zeichen lang sein",
      "string.max": "Die Hausnummer darf höchstens {#limit} Zeichen lang sein",
    }),
  country: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "string.empty": "Das Land muss angegeben werden",
      "string.pattern.base": "Das Land darf nur aus Buchstaben bestehen",
    }),
  tel: Joi.string()
    .regex(/^\+[0-9]+$/)
    .messages({
      "string.pattern.base":
        "Die Telefonnummer muss mit '+' beginnen und darf nur aus Zahlen bestehen",
    }),
});

// Checks SignIn data
export const signInSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "de", "net"] } })
    .required()
    .messages({
      "string.email": "Die E-Mail muss mit .com, .de oder .net enden",
      "string.empty": "Die E-Mail muss angegeben werden",
    }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.min": "Passwort muss mindestens {#limit} Zeichen lang sein",
    "string.max": "Passwort darf höchstens {#limit} Zeichen lang sein",
    "string.empty": "Passwort muss angegeben werden",
  }),
});

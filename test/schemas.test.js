import { expect } from "chai";
import {
  connectTestDB,
  disconnectTestDB,
  dropTestCollections,
} from "../db/setupTestDB.js";
import { userSchema, signInSchema } from "../joi/schemas.js";

// ToDo: Redo birth_date test, password test, tel test

describe("User Schema", () => {
  let user;
  let error;

  before(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await dropTestCollections();

    user = {
      salutation: "Herr",
      firstname: "Max",
      lastname: "Mustermann",
      birth_date: "1992-01-01",
      email: "max.mustermann@example.com",
      password: "12345678",
      zip_code: "12345",
      city: "Berlin",
      street: "Musterstraße",
      street_number: "1a",
      country: "Deutschland",
      tel: "+491234567891",
    };
  });

  after(async () => {
    await disconnectTestDB();
  });

  it("validates a user with valid data", () => {
    expect(error).to.not.exist;
  });

  it("fails for a user with a missing salutation", () => {
    user.salutation = "";
    error = userSchema.validate(user).error;
    expect(error.details[0].message).to.equal("Anrede muss angegeben werden");
  });

  it("fails for a user with invalid or missing firstname", () => {
    const testCases = [
      {
        firstname: "Max1",
        message: "Der Vorname darf nur aus Buchstaben bestehen",
      },
      {
        firstname: "Max!",
        message: "Der Vorname darf nur aus Buchstaben bestehen",
      },
      { firstname: "", message: "Der Vorname muss angegeben werden" },
    ];

    for (const testCase of testCases) {
      user.firstname = testCase.firstname;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with invalid or missing lastname", () => {
    const testCases = [
      {
        lastname: "Mustermann1",
        message: "Der Nachname darf nur aus Buchstaben bestehen",
      },
      {
        lastname: "Mustermann!",
        message: "Der Nachname darf nur aus Buchstaben bestehen",
      },
      { lastname: "", message: "Der Nachname muss angegeben werden" },
    ];

    for (const testCase of testCases) {
      user.lastname = testCase.lastname;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with a invalid or missing birth date", () => {
    const testCases = [
      {
        birth_date: "2030-01-01",
        message: "Das Geburtsdatum darf nicht in der Zukunft liegen",
      },
      {
        birth_date: "",
        message: "Das Geburtsdatum muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.birth_date = testCase.birth_date;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing email", () => {
    const testCases = [
      {
        email: "invalid-email",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "invalid-email.biz",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "öäinvalid-email.com",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "!invalid-email.com",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "",
        message: "Die E-Mail muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.email = testCase.email;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing password", () => {
    const testCases = [
      {
        password: "1234567",
        message: "Passwort muss mindestens 8 Zeichen lang sein",
      },
      {
        password: "012345678901234567891",
        message: "Passwort darf höchstens 20 Zeichen lang sein",
      },
      {
        password: "",
        message: "Passwort muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.password = testCase.password;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing zip code", () => {
    const testCases = [
      {
        zip_code: "123",
        message: "Die Postleitzahl muss mindestens 4 Zeichen lang sein",
      },
      {
        zip_code: "123456",
        message: "Die Postleitzahl darf höchstens 5 Zeichen lang sein",
      },
      {
        zip_code: "1234a",
        message: "Die Postleitzahl darf nur Nummern enthalten",
      },
      {
        zip_code: "1234!",
        message: "Die Postleitzahl darf nur Nummern enthalten",
      },
      {
        zip_code: "",
        message: "Die Postleitzahl muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.zip_code = testCase.zip_code;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing city", () => {
    const testCases = [
      {
        city: "Berlin1",
        message: "Die Stadt darf nur aus Buchstaben bestehen",
      },
      {
        city: "Berlin!",
        message: "Die Stadt darf nur aus Buchstaben bestehen",
      },
      {
        city: "",
        message: "Die Stadt muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.city = testCase.city;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing street", () => {
    const testCases = [
      {
        street: "Musterstraße1",
        message:
          "Die Straße darf nur aus Buchstaben, Leerzeichen oder Bindestrich bestehen",
      },
      {
        street: "Musterstraße!",
        message:
          "Die Straße darf nur aus Buchstaben, Leerzeichen oder Bindestrich bestehen",
      },
      {
        street: "",
        message: "Die Straße muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.street = testCase.street;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing street number", () => {
    const testCases = [
      {
        street_number: "1!",
        message: "Die Hausnummer darf nur aus Buchstaben und Zahlen bestehen",
      },
      {
        street_number: "123456",
        message: "Die Hausnummer darf höchstens 5 Zeichen lang sein",
      },
      {
        street_number: "",
        message: "Die Hausnummer muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.street_number = testCase.street_number;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing country", () => {
    const testCases = [
      {
        country: "Deutschland1",
        message: "Das Land darf nur aus Buchstaben bestehen",
      },
      {
        country: "Deutschland!",
        message: "Das Land darf nur aus Buchstaben bestehen",
      },
      {
        country: "",
        message: "Das Land muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.country = testCase.country;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid phone number", () => {
    const testCases = [
      {
        tel: "123456789",
        message:
          "Die Telefonnummer muss mit '+' beginnen und darf nur aus Zahlen bestehen",
      },
    ];

    for (const testCase of testCases) {
      user.tel = testCase.tel;
      error = userSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });
});

describe("SignIn Schema", () => {
  let user;
  let error;

  before(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await dropTestCollections();

    user = {
      email: "max.mustermann@example.com",
      password: "12345678",
    };
  });

  after(async () => {
    await disconnectTestDB();
  });

  it("validates a user with a valid email and password", () => {
    expect(error).to.not.exist;
  });

  it("fails for a user with an invalid or missing email", () => {
    const testCases = [
      {
        email: "invalid-email",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "invalid-email.biz",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "öäinvalid-email.com",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "!invalid-email.com",
        message: "Die E-Mail muss mit .com, .de oder .net enden",
      },
      {
        email: "",
        message: "Die E-Mail muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.email = testCase.email;
      error = signInSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });

  it("fails for a user with an invalid or missing password", () => {
    const testCases = [
      {
        password: "1234567",
        message: "Passwort muss mindestens 8 Zeichen lang sein",
      },
      {
        password: "012345678901234567891",
        message: "Passwort darf höchstens 20 Zeichen lang sein",
      },
      {
        password: "",
        message: "Passwort muss angegeben werden",
      },
    ];

    for (const testCase of testCases) {
      user.password = testCase.password;
      error = signInSchema.validate(user).error;
      expect(error.details[0].message).to.equal(testCase.message);
    }
  });
});

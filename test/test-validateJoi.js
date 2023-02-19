import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import validateJOI from "../middlewares/validateJOI.js";
import { userSchema } from "../joi/schemas.js";
import {
  connectTestDB,
  disconnectTestDB,
  dropTestCollections,
} from "../db/setupTestDB.js";

describe("Validate Joi", () => {
  before(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await dropTestCollections();
  });

  after(async () => {
    await disconnectTestDB();
  });

  it("should pass the request to the next middleware if the request body is valid", async () => {
    const user = {
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
    };

    const appWithMiddleware = app;
    appWithMiddleware.post(
      "/auth/signup",
      validateJOI(userSchema),
      (req, res) => {
        res.sendStatus(201);
      }
    );

    const response = await request(appWithMiddleware)
      .post("/auth/signup")
      .send(user)
      .expect(201);
    expect(response.body.error).to.be.undefined;
  });

  it("should return a 400 error if the request body is invalid", async () => {
    const user = {
      salutation: "Herr",
      firstname: 123,
      lastname: "!?Mustermann",
      birth_date: "1992-01-01",
      email: "max.mustermann@example.com",
      password: "12345678",
      zip_code: "12345",
      city: "Berlin",
      street: "Musterstraße",
      street_number: "1a",
      country: "",
    };

    const appWithMiddleware = app;
    appWithMiddleware.post(
      "/auth/signup",
      validateJOI(userSchema),
      (req, res) => {
        res.sendStatus(200);
      }
    );

    const response = await request(appWithMiddleware)
      .post("/auth/signup")
      .send(user)
      .expect(400);

    expect(response.body.error).to.be.not.undefined;
    expect(response.body.errorType).to.equal("Validation Error");
    expect(response.body.errorCode).to.equal("Joi_001");
  });
});

import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  connectTestDB,
  disconnectTestDB,
  dropTestCollections,
} from "../db/setupTestDB.js";

describe("Authentication", () => {
  describe("POST /auth/signup", () => {
    before(async () => {
      await connectTestDB();
    });

    beforeEach(async () => {
      await dropTestCollections();
    });

    after(async () => {
      await disconnectTestDB();
    });

    it("should create a new user and return a token", async () => {
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
        tel: "+491234567891",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(user)
        .expect(201);

      const createdUser = await User.findOne({ email: user.email });
      expect(createdUser).to.exist;
      expect(createdUser.password).to.not.equal(user.password);
      expect(await bcrypt.compare(user.password, createdUser.password)).to.be
        .true;
      expect(response.body.token).to.exist;

      const decoded = jwt.verify(response.body.token, process.env.SECRET_KEY);
      expect(decoded._id.toString()).to.equal(createdUser._id.toString());
    });

    it("should return 403 if the email already exists", async () => {
      const existingUser = {
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
      await User.create(existingUser);

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
        tel: "+491234567891",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(user)
        .expect(403);

      expect(response.body.error).to.equal("E-Mail existiert bereits");
      expect(response.body.errorType).to.equal("Validation Error");
      expect(response.body.errorCode).to.equal("AUTH_001");
    });

    it("should return a 400 error if any required fields are missing", async () => {
      const requiredFields = [
        "salutation",
        "firstname",
        "lastname",
        "birth_date",
        "email",
        "password",
        "zip_code",
        "city",
        "street",
        "country",
      ];

      const user = {
        salutation: "Herr",
        lastname: "Mustermann",
        birth_date: "1992-01-01",
        email: "max.mustermann@example.com",
        password: "12345678",
        zip_code: "12345",
        city: "Berlin",
        street: "Musterstraße",
        country: "Deutschland",
      };

      // Remove any fields that are present in the user object
      const missingFields = requiredFields.filter((field) => !(field in user));

      const response = await request(app)
        .post("/auth/signup")
        .send(user)
        .expect(400);

      expect(response.body.error).to.equal(`"${missingFields[0]}" is required`);
    });
  });

  //------------------------------------------------------------------------------

  describe("POST /auth/signin", () => {
    before(async () => {
      await connectTestDB();
    });

    beforeEach(async () => {
      await dropTestCollections();

      // Create a test user with a known password hash before every test case
      const user = {
        salutation: "Herr",
        firstname: "Max",
        lastname: "Mustermann",
        birth_date: "1992-01-01",
        email: "max.mustermann@example.com",
        password: await bcrypt.hash("12345678", 5),
        zip_code: "12345",
        city: "Berlin",
        street: "Musterstraße",
        street_number: "1a",
        country: "Deutschland",
        tel: "+491234567891",
      };
      await User.create(user);
    });

    after(async () => {
      await disconnectTestDB();
    });

    it("should return a token if email and password are correct", async () => {
      const user = {
        email: "max.mustermann@example.com",
        password: "12345678",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(user)
        .expect(201);

      expect(response.body.token).to.exist;
    });

    it("should return 404 if no user is found with the given email", async () => {
      const user = {
        email: "notfound@example.com",
        password: "12345678",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(user)
        .expect(404);

      expect(response.body.error).to.equal(
        "Es ist kein User mit dieser E-Mail registriert."
      );
      expect(response.body.errorType).to.equal("Not Found");
      expect(response.body.errorCode).to.equal("AUTH_002");
    });

    it("should return 401 if the password is incorrect", async () => {
      const user = {
        email: "max.mustermann@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(user)
        .expect(401);

      expect(response.body.error).to.equal("Falsches Passwort");
      expect(response.body.errorType).to.equal("Unauthorized");
      expect(response.body.errorCode).to.equal("AUTH_003");
    });
  });

  //------------------------------------------------------------------------------

  describe("GET /auth/me", () => {
    before(async () => {
      await connectTestDB();
    });

    beforeEach(async () => {
      await dropTestCollections();

      // Create a test user with a known ID
      const user = {
        _id: "605cb50d68b21b14dcf9a1a3",
        salutation: "Herr",
        firstname: "Max",
        lastname: "Mustermann",
        birth_date: "1992-01-01",
        email: "max.mustermann@example.com",
        password: await bcrypt.hash("12345678", 5),
        zip_code: "12345",
        city: "Berlin",
        street: "Musterstraße",
        street_number: "1a",
        country: "Deutschland",
        tel: "+491234567891",
      };
      await User.create(user);
    });

    after(async () => {
      await disconnectTestDB();
    });

    it("should return the user if the token is valid", async () => {
      const token = jwt.sign(
        { _id: "605cb50d68b21b14dcf9a1a3" },
        process.env.SECRET_KEY
      );

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", token)
        .expect(200);

      expect(response.body.email).to.equal("max.mustermann@example.com");
      expect(response.body.password).to.not.exist;
    });

    it("should return 401 if the token is not provided", async () => {
      const response = await request(app).get("/auth/me").expect(401);

      expect(response.body.error).to.equal("Bitte zuerst einloggen.");
      expect(response.body.errorType).to.equal("Unauthorized");
      expect(response.body.errorCode).to.equal("AUTH_005");
    });
  });

  describe("DELETE /auth/me", () => {
    let user;

    before(async () => {
      await connectTestDB();
    });

    beforeEach(async () => {
      await dropTestCollections();
      user = {
        _id: "605cb50d68b21b14dcf9a1a3",
        salutation: "Herr",
        firstname: "Max",
        lastname: "Mustermann",
        birth_date: "1992-01-01",
        email: "max.mustermann@example.com",
        password: await bcrypt.hash("12345678", 5),
        zip_code: "12345",
        city: "Berlin",
        street: "Musterstraße",
        street_number: "1a",
        country: "Deutschland",
        tel: "+491234567891",
      };
      await User.create(user);
    });

    after(async () => {
      await disconnectTestDB();
    });

    it("should delete the user from the DB", async () => {
      const token = jwt.sign(
        { _id: "605cb50d68b21b14dcf9a1a3" },
        process.env.SECRET_KEY
      );

      const response = await request(app)
        .delete("/auth/me")
        .set("Authorization", token)
        .expect(200);
      expect(response.body.message).to.equal("User erfolgreich gelöscht.");
    });

    it("should return 401 if the token is not provided", async () => {
      const response = await request(app).delete("/auth/me").expect(401);

      expect(response.body.error).to.equal("Bitte zuerst einloggen.");
      expect(response.body.errorType).to.equal("Unauthorized");
      expect(response.body.errorCode).to.equal("AUTH_005");
    });

    it("should return 401 if the token is invalid", async () => {
      const token = jwt.sign(
        { _id: "invalidToken" },

        process.env.SECRET_KEY
      );

      const response = await request(app)
        .delete("/auth/me")
        .set("Authorization", token)
        .expect(404);

      expect(response.body.error).to.equal(`User nicht gefunden.`);
      expect(response.body.errorType).to.equal("Not Found");
      expect(response.body.errorCode).to.equal("AUTH_004");
    });
  });
});

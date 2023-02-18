import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  connectTestDB,
  dropTestDB,
  dropTestCollections,
} from "../db/setupTestDB.js";

describe("signUp", () => {
  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await dropTestDB();
  });

  afterEach(async () => {
    await dropTestCollections();
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

  it("should return a 400 error if the email is missing in the request", async () => {
    const user = {
      salutation: "Herr",
      firstname: "Max",
      lastname: "Mustermann",
      birth_date: "1992-01-01",
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
      .expect(500);

    expect(response.body.error).to.equal('"email" is required');
  });
});

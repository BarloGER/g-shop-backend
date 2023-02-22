import jwt from "jsonwebtoken";
import { expect } from "chai";
import request from "supertest";
import User from "../models/User.js";
import app from "../server.js";
import {
  connectTestDB,
  disconnectTestDB,
  dropTestCollections,
} from "../db/setupTestDB.js";

describe("Verify Token", () => {
  let user, token;

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await dropTestCollections();

    // Create a test user with a known ID
    user = {
      _id: "605cb50d68b21b14dcf9a1a3",
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
    await User.create(user);
    token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should set req.userId to the decoded user ID if a valid authorization header is provided", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", token)
      .expect(200);

    expect(response.body._id).to.equal("605cb50d68b21b14dcf9a1a3");
  });

  it("should return 401 Unauthorized if no authorization header is provided", async () => {
    const response = await request(app).get("/auth/me").expect(401);

    expect(response.body.error).to.equal("Bitte zuerst einloggen.");
    expect(response.body.errorType).to.equal("Unauthorized");
    expect(response.body.errorCode).to.equal("AUTH_005");
  });

  it("should return 401 Unauthorized if an invalid authorization header is provided", async () => {
    token = "invalid token";
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", token)
      .expect(401);

    expect(response.body.error).to.equal("Ungültiger Token");
    expect(response.body.errorType).to.equal("Unauthorized");
    expect(response.body.errorCode).to.equal("AUTH_006");
  });
});

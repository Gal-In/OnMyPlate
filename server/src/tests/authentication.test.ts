import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/postModel";
import { Express } from "express";
import userModel, { User } from "../models/userModel";

var app: Express;

const baseUrl = "/auth";

type TestUser = User & {
  accessToken?: string;
  refreshToken?: string;
};

const userBaseDetails = {
  name: "user",
  username: "user",
  email: "user@test.com",
  password: "123",
  isGoogleUser: false,
};

let testUser: TestUser | null = null;

beforeAll(async () => {
  app = await initApp();
  await Promise.all([postModel.deleteMany(), userModel.deleteMany()]);
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Authentication Tests", () => {
  test("test authentication register", async () => {
    const response = await request(app)
      .post(baseUrl + "/registration")
      .send(userBaseDetails);

    testUser = {
      ...userBaseDetails,
      _id: response.body._id,
      refreshTokens: response.body.refreshTokens,
    };

    expect(response.statusCode).toBe(201);
  });
  test("test authentication register fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/registration")
      .send({
        email: "user@",
      });
    expect(response.statusCode).not.toBe(200);
  });
  test("test authentication login", async () => {
    if (testUser) {
      const response = await request(app)
        .post(baseUrl + "/login")
        .send(testUser);

      expect(response.statusCode).toBe(200);
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      testUser.accessToken = accessToken;
      testUser.refreshToken = refreshToken;
    }
  });
  test("Auth test login fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser!.email,
        password: "12",
      });

    expect(response.statusCode).not.toBe(200);
  });
  test("test request authentication", async () => {
    const allPostsResponse = await request(app).post("/posts").send({
      description: "post content 1",
      restaurantName: "restaurant name 1",
      rating: 4,
      googleApiRating: 4.2,
    });
    expect(allPostsResponse.statusCode).not.toBe(201);
    const allPostsResponseWithAuth = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser!.accessToken })
      .send({
        description: "post content 1",
        restaurantName: "restaurant name 1",
        rating: 4,
        googleApiRating: 4.2,
      });
    expect(allPostsResponseWithAuth.statusCode).toBe(201);
  });
  test("test refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refreshToken")
      .set({
        authorization: "JWT " + testUser!.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser!.accessToken = response.body.accessToken;
    testUser!.refreshToken = response.body.refreshToken;
  });
  test("use refresh token twice", async () => {
    const response = await request(app)
      .post(baseUrl + "/refreshToken")
      .set({
        authorization: "JWT " + testUser!.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    const newRefreshToken = response.body.refreshToken;
    const sameTokenResponse = await request(app)
      .post(baseUrl + "refreshToken")
      .set({
        authorization: "JWT " + newRefreshToken,
      });
    expect(sameTokenResponse.statusCode).not.toBe(200);
  });
  test("Test logout", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser!);
    expect(response.statusCode).toBe(200);
    testUser!.accessToken = response.body.accessToken;
    testUser!.refreshToken = response.body.refreshToken;
    const logoutResponse = await request(app)
      .post(baseUrl + "/logout")
      .set({
        authorization: "JWT " + testUser!.refreshToken,
      });
    expect(logoutResponse.statusCode).toBe(200);
    const refreshResponse = await request(app)
      .post(baseUrl + "refreshToken")
      .send({
        refreshToken: testUser!.refreshToken,
      });
    expect(refreshResponse.statusCode).not.toBe(200);
  });
  jest.setTimeout(10000);
  test("Test timeout token", async () => {
    if (testUser) {
      const response = await request(app)
        .post(baseUrl + "/login")
        .send(testUser);
      expect(response.statusCode).toBe(200);
      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response2 = await request(app)
        .post("/posts")
        .set({ authorization: "JWT " + testUser.accessToken })
        .send({
          title: "post",
          content: "content",
          senderId: "user",
        });
      expect(response2.statusCode).not.toBe(201);
      const response3 = await request(app)
        .post(baseUrl + "/refreshToken")
        .set({
          authorization: "JWT " + testUser.refreshToken,
        });
      expect(response3.statusCode).toBe(200);
      testUser.accessToken = response3.body.accessToken;
      const response4 = await request(app)
        .post("/posts")
        .set({ authorization: "JWT " + testUser.accessToken })
        .send({
          description: "post content 1",
          restaurantName: "restaurant name 1",
          rating: 4,
          googleApiRating: 4.2,
        });
      expect(response4.statusCode).toBe(201);
    }
  });
});

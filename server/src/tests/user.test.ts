import mongoose from "mongoose";
import initApp from "../server";
import { Express } from "express";
import userModel, { User } from "../models/userModel";
import request from "supertest";
import authenticationController from "../controller/authenticationController";

const testUsersArr: Partial<User>[] = [
  { username: "user1", email: "user1@gmail.com", password: "A" },
  { username: "user2", email: "user2@gmail.com", password: "B" },
  { username: "user3", email: "user3@gmail.com", password: "C" },
];

let app: Express;
let oldToken: string;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Test Users API", () => {
  test("Get all users before adding", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.statusCode).toEqual(200);
    expect(allUsers.body.length).toEqual(0);
  });

  test("Add single user", async () => {
    const userToAdd = testUsersArr[0];

    const singleUser = await request(app)
      .post("/auth/registration")
      .send(userToAdd);

    const { body, statusCode }: { body: User; statusCode: number } = singleUser;

    expect(statusCode).toEqual(201);
    expect(body.username).toEqual(userToAdd.username);
    expect(body.email).toEqual(userToAdd.email);
    expect(body.refreshTokens).toEqual([]);

    testUsersArr[0]._id = body._id;
  });
  test("Add existing user", async () => {
    const userToAdd = testUsersArr[0];

    const response = await request(app)
      .post("/auth/registration")
      .send(userToAdd);

    expect(response.statusCode).toEqual(400);
  });
  test("Test get users after add single user", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.statusCode).toEqual(200);
    expect(allUsers.body.length).toEqual(1);

    expect(allUsers.body[0].username).toEqual(testUsersArr[0].username);
    expect(allUsers.body[0].email).toEqual(testUsersArr[0].email);
    expect(allUsers.body[0]._id).toEqual(testUsersArr[0]._id);
  });
  test("Add many users", async () => {
    for (const index of [1, 2]) {
      const userToAdd = testUsersArr[index];
      const response = await request(app)
        .post("/auth/registration")
        .send(userToAdd);

      const { body, statusCode }: { body: User; statusCode: number } = response;

      expect(statusCode).toEqual(201);
      expect(body.username).toEqual(userToAdd.username);
      expect(body.email).toEqual(userToAdd.email);
      expect(body.refreshTokens).toEqual([]);
      testUsersArr[index]._id = body._id;
    }
  });
  test("Get single user by user id", async () => {
    const response = await request(app).get(`/users/${testUsersArr[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.username).toEqual(testUsersArr[0].username);
    expect(response.body.email).toEqual(testUsersArr[0].email);
    expect(response.body._id).toEqual(testUsersArr[0]._id);
  });
  test("Get all users after adding many", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.statusCode).toEqual(200);
    expect(allUsers.body.length).toEqual(3);
  });
  test("Update invalid user", async () => {
    const {
      body: { accessToken },
    } = await request(app).post("/auth/login").send({
      username: testUsersArr[0].username,
      password: testUsersArr[0].password,
    });

    expect(accessToken).toBeDefined();

    const response = await request(app)
      .put(`/users`)
      .set({
        authorization: `JWT ${accessToken}`,
      })
      .send({
        username: testUsersArr[1].usernmae,
        email: "NEW EMAIL",
      });

    expect(response.statusCode).toEqual(409);
  });
  test("Update user", async () => {
    const {
      body: { accessToken },
    } = await request(app).post("/auth/login").send({
      username: testUsersArr[0].username,
      password: testUsersArr[0].password,
    });

    expect(accessToken).toBeDefined();

    const response = await request(app)
      .put(`/users`)
      .set({
        authorization: `JWT ${accessToken}`,
      })
      .send({
        email: "NEW EMAIL",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.username).toEqual(testUsersArr[0].username);
    expect(response.body.email).toEqual("NEW EMAIL");
  });
  test("Test update user with incorrect token", async () => {
    const response = await request(app).put(`/users`).set({
      authorization: "JWT something",
    });

    expect(response.statusCode).toEqual(403);
  });

  test("Test get specific user after update user", async () => {
    const response = await request(app).get(`/users/${testUsersArr[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.username).toEqual(testUsersArr[0].username);
    expect(response.body.email).toEqual("NEW EMAIL");
    expect(response.body._id).toEqual(testUsersArr[0]._id);
  });
  test("Test update user without token", async () => {
    const response = await request(app).put(`/users`).send({
      email: "NEW EMAIL 2",
    });

    expect(response.statusCode).toEqual(401);
  });
  test("Delete user", async () => {
    const {
      body: { accessToken },
    } = await request(app).post("/auth/login").send({
      username: testUsersArr[0].username,
      password: testUsersArr[0].password,
    });

    expect(accessToken).toBeDefined();

    const response = await request(app)
      .delete(`/users`)
      .set({
        authorization: `JWT ${accessToken}`,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.username).toEqual(testUsersArr[0].username);
    expect(response.body.email).toEqual("NEW EMAIL");
    expect(response.body._id).toEqual(testUsersArr[0]._id);

    oldToken = accessToken;
  });
  test("Test get all after delete user", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.statusCode).toEqual(200);
    expect(allUsers.body.length).toEqual(2);
  });
  test("Test delete already deleted user", async () => {
    const response = await request(app)
      .delete(`/users`)
      .set({
        authorization: `JWT ${oldToken}`,
      });

    expect(response.statusCode).toEqual(400);
  });
});

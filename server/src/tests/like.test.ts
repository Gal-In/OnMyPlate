import mongoose from "mongoose";
import postModel, { Post } from "../models/postModel";
import initApp from "../server";
import { Express } from "express";
import userModel, { User } from "../models/userModel";
import request from "supertest";

const POSTS_TO_ADD = [
  {
    description: "post content 1",
    restaurantName: "restaurant name 1",
    rating: 4,
    googleApiRating: 4.2,
  },
  {
    description: "post content 2",
    restaurantName: "restaurant name 2",
    rating: 5,
    googleApiRating: 4.7,
  },
];

const USER_BASE_DETAILS = {
  name: "dan",
  username: "dan",
  password: "dan123",
  email: "dan@gmail.com",
};

let app: Express;
let baseUser: User & { token: string };
let postsWithId: Post[];

beforeAll(async () => {
  app = await initApp();

  await Promise.all([postModel.deleteMany(), userModel.deleteMany()]);
  const { body: userDetails } = await request(app)
    .post("/auth/registration")
    .send(USER_BASE_DETAILS);

  const {
    body: { accessToken },
  } = await request(app).post("/auth/login").send({
    username: USER_BASE_DETAILS.username,
    password: USER_BASE_DETAILS.password,
  });

  baseUser = { ...(userDetails as User), token: accessToken };

  const postWithId1 = await request(app)
    .post("/post")
    .set({ authorization: "JWT " + baseUser.token })
    .send(POSTS_TO_ADD[0]);

  const postWithId2 = await request(app)
    .post("/post")
    .set({ authorization: "JWT " + baseUser.token })
    .send(POSTS_TO_ADD[1]);

  postsWithId = [postWithId1.body, postWithId2.body];
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Test Likes API", () => {
  test("Get all likes of post before adding", async () => {
    const allPosts = await request(app).get(`/like/${postsWithId[0]._id}`);

    expect(allPosts.statusCode).toEqual(200);
    expect(allPosts.body.amount).toEqual(0);
  });

  //   test("Add single like", async () => {
  //     const singleLike = await request(app)
  //       .post("/like")
  //       .set({ authorization: "JWT " + baseUser.token })
  //       .send({ postId: postsWithId[0]._id });

  //     expect(singleLike.statusCode).toEqual(201);
  //     expect(singleLike.body.postId).toEqual(postsWithId[0]._id);
  //     expect(singleLike.body.userId).toEqual(baseUser._id);
  //   });

  //   test("Test like count after adding like", async () => {});

  //   test("Try to add exising like on post", async () => {});
});

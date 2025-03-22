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

const USER_BASE_DETAILS = [
  {
    name: "dan",
    username: "dan",
    password: "dan123",
    email: "dan@gmail.com",
  },
  {
    name: "dan2",
    username: "dan2",
    password: "dan1232",
    email: "dan2@gmail.com",
  },
];

let app: Express;
let baseUsers: (User & { token: string })[];
let postsWithId: Post[];

beforeAll(async () => {
  app = await initApp();

  await Promise.all([postModel.deleteMany(), userModel.deleteMany()]);

  const [response1, response2] = await Promise.all(
    USER_BASE_DETAILS.map((userBaseDetail) =>
      request(app).post("/auth/registration").send(userBaseDetail)
    )
  );

  const [authRes1, authRes2] = await Promise.all(
    USER_BASE_DETAILS.map((userBaseDetail) =>
      request(app).post("/auth/login").send({
        username: userBaseDetail.username,
        password: userBaseDetail.password,
      })
    )
  );

  const baseUser1 = {
    ...(response1.body.userDetails as User),
    token: authRes1.body.accessToken,
  };
  const baseUser2 = {
    ...(response2.body.userDetails as User),
    token: authRes2.body.accessToken,
  };

  baseUsers = [baseUser1, baseUser2];

  const postWithId1 = await request(app)
    .post("/posts")
    .set({ authorization: "JWT " + baseUsers[0].token })
    .send(POSTS_TO_ADD[0]);

  const postWithId2 = await request(app)
    .post("/posts")
    .set({ authorization: "JWT " + baseUsers[0].token })
    .send(POSTS_TO_ADD[1]);

  postsWithId = [postWithId1.body, postWithId2.body];
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Test Likes API", () => {
  test("Get all likes of post before adding", async () => {
    const response = await request(app).get(`/like/${postsWithId[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.amount).toEqual(0);
  });

  test("Add single like", async () => {
    const singleLike = await request(app)
      .post("/like")
      .set({ authorization: "JWT " + baseUsers[0].token })
      .send({ postId: postsWithId[0]._id });

    expect(singleLike.statusCode).toEqual(201);
    expect(singleLike.body.postId).toEqual(postsWithId[0]._id);
  });

  test("Test like count after adding like", async () => {
    const response = await request(app).get(`/like/${postsWithId[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.amount).toEqual(1);
  });

  test("Try to add exising like on post", async () => {
    const singleLike = await request(app)
      .post("/like")
      .set({ authorization: "JWT " + baseUsers[0].token })
      .send({ postId: postsWithId[0]._id });

    expect(singleLike.statusCode).toEqual(409);
  });

  test("Try to add another like from same user different post", async () => {
    const singleLike = await request(app)
      .post("/like")
      .set({ authorization: "JWT " + baseUsers[0].token })
      .send({ postId: postsWithId[1]._id });

    expect(singleLike.statusCode).toEqual(201);
    expect(singleLike.body.postId).toEqual(postsWithId[1]._id);
  });

  test("Add another like to same post different user", async () => {
    const singleLike = await request(app)
      .post("/like")
      .set({ authorization: "JWT " + baseUsers[1].token })
      .send({ postId: postsWithId[0]._id });

    expect(singleLike.statusCode).toEqual(201);
    expect(singleLike.body.postId).toEqual(postsWithId[0]._id);
  });

  test("Test likes amount after two different users liked the post", async () => {
    const response = await request(app).get(`/like/${postsWithId[0]._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.amount).toEqual(2);
  });
});

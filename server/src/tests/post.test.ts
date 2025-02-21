import mongoose from "mongoose";
import postModel, { Post } from "../models/postModel";
import initApp from "../server";
import { Express } from "express";
import userModel, { User } from "../models/userModel";
import request from "supertest";

const testPostsArr = [
  { content: "post content 1", title: "post title 1" },
  { content: "post content 2", title: "post title 2" },
  { content: "post content 3", title: "post title 3" },
];

const USER_BASE_DETAILS = {
  username: "dan",
  password: "dan123",
  email: "dan@gmail.com",
};

let app: Express;
let baseUser: User & { token: string };
let postId: string;

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
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Test Posts API", () => {
  test("Get all posts before adding", async () => {
    const allPosts = await request(app).get("/posts");

    expect(allPosts.statusCode).toEqual(200);
    expect(allPosts.body.length).toEqual(0);
  });

  test("Add single post", async () => {
    const testPostToAdd = testPostsArr[0];
    const singlePost = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + baseUser.token })
      .send(testPostToAdd);

    expect(singlePost.statusCode).toEqual(201);
    expect(singlePost.body.content).toEqual(testPostToAdd.content);
    expect(singlePost.body.title).toEqual(testPostToAdd.title);
    expect(singlePost.body.senderId).toEqual(baseUser._id);

    postId = singlePost.body._id;
  });

  test("Get all posts after add single post", async () => {
    const allPosts = await request(app).get("/posts");

    expect(allPosts.statusCode).toEqual(200);
    expect(allPosts.body.length).toEqual(1);
  });

  test("Add posts", async () => {
    const postsLeftToTest = testPostsArr.filter((_, i) => i !== 0);

    for (const testPostToAdd of postsLeftToTest) {
      const { statusCode, body: singlePost } = await request(app)
        .post("/posts")
        .set({ authorization: "JWT " + baseUser.token })
        .send(testPostToAdd);

      expect(statusCode).toEqual(201);
      expect(singlePost.content).toEqual(testPostToAdd.content);
      expect(singlePost.title).toEqual(testPostToAdd.title);
      expect(singlePost.senderId).toEqual(baseUser._id);
    }
  });

  test("Test get posts by sender id", async () => {
    const response = await request(app).get(
      `/posts/sender=/${baseUser._id.toString()}`
    );

    expect(response.body.length).toEqual(3);
    expect(response.statusCode).toEqual(200);

    response.body.forEach((currPost: Post, index: number) => {
      const expectedPost = testPostsArr[index];

      expect(currPost.content).toEqual(expectedPost.content);
      expect(currPost.title).toEqual(expectedPost.title);
      expect(currPost.senderId).toEqual(baseUser._id);
    });
  });

  test("Test get posts by incorrect sender id", async () => {
    const response = await request(app).get(
      "/posts/sender=/6780eba5f7a9d4a880c56d6b"
    );

    expect(response.body.length).toEqual(0);
    expect(response.statusCode).toEqual(200);
  });

  test("Test get all 3 posts", async () => {
    const allPosts = await request(app).get("/posts");

    expect(allPosts.body.length).toEqual(3);
    expect(allPosts.statusCode).toEqual(200);

    allPosts.body.forEach((currPost: Post, index: number) => {
      const expectedPost = testPostsArr[index];

      expect(currPost.content).toEqual(expectedPost.content);
      expect(currPost.title).toEqual(expectedPost.title);
      expect(currPost.senderId).toEqual(baseUser._id);
    });
  });

  test("Get post by post id", async () => {
    const { body: currPost, statusCode } = await request(app).get(
      `/posts/${postId}`
    );
    const postContentToBe = testPostsArr[0];

    expect(statusCode).toEqual(200);
    expect(currPost.content).toEqual(postContentToBe.content);
    expect(currPost.title).toEqual(postContentToBe.title);
    expect(currPost.senderId).toEqual(baseUser._id);
  });

  test("Test get post by incorrect post id", async () => {
    const response = await request(app).get("/posts/67474e24de29b0dc9d30e96c");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({});
  });

  test("Update Post", async () => {
    const { body: updatedPost, statusCode } = await request(app)
      .put(`/posts/${postId}`)
      .set({ authorization: "JWT " + baseUser.token })
      .send({
        title: "NEW TITLE",
        content: "NEW CONTENT",
      });

    expect(statusCode).toEqual(200);
    expect(updatedPost.title).toEqual("NEW TITLE");
    expect(updatedPost.content).toEqual("NEW CONTENT");
    expect(updatedPost._id).toEqual(postId);
    expect(updatedPost.senderId).toEqual(baseUser._id);
  });

  test("Check updated Post", async () => {
    const { body: currPost, statusCode } = await request(app).get(
      `/posts/${postId}`
    );

    expect(statusCode).toEqual(200);
    expect(currPost.title).toEqual("NEW TITLE");
    expect(currPost.content).toEqual("NEW CONTENT");
    expect(currPost.senderId).toEqual(baseUser._id);
    expect(currPost._id).toEqual(postId);
  });

  test("Test updating post without token", async () => {
    const response = await request(app).put(`/posts/${postId}`).send({
      title: "NEW TITLE 2",
      content: "NEW CONTENT 2",
    });

    expect(response.statusCode).toBe(401);
  });
});

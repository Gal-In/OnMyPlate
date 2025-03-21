import mongoose from "mongoose";
import postModel, { Post } from "../models/postModel";
import initApp from "../server";
import { Express } from "express";
import userModel, { User } from "../models/userModel";
import request from "supertest";

const testPostsArr = [
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
  {
    description: "post content 3",
    restaurantName: "restaurant name 3",
    rating: 3,
    googleApiRating: 3.2,
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
    const allPosts = await request(app).get("/posts/0/100");

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
    expect(singlePost.body.description).toEqual(testPostToAdd.description);
    expect(singlePost.body.restaurantName).toEqual(
      testPostToAdd.restaurantName
    );
    expect(singlePost.body.rating).toEqual(testPostToAdd.rating);
    expect(singlePost.body.googleApiRating).toEqual(
      testPostToAdd.googleApiRating
    );

    postId = singlePost.body._id;
  });

  test("Get all posts after add single post", async () => {
    const allPosts = await request(app).get("/posts/0/100");

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
      expect(singlePost.description).toEqual(testPostToAdd.description);
      expect(singlePost.restaurantName).toEqual(testPostToAdd.restaurantName);
      expect(singlePost.rating).toEqual(testPostToAdd.rating);
      expect(singlePost.googleApiRating).toEqual(testPostToAdd.googleApiRating);
    }
  });
  // test("Test get posts by sender id", async () => {
  //   const response = await request(app).get(
  //     `/posts/sender=/${baseUser._id.toString()}`
  //   );

  //   expect(response.body.length).toEqual(3);
  //   expect(response.statusCode).toEqual(200);

  //   response.body.forEach((currPost: Post, index: number) => {
  //     const expectedPost = testPostsArr[index];

  //     expect(currPost.description).toEqual(expectedPost.description);
  //     expect(currPost.restaurantName).toEqual(expectedPost.restaurantName);
  //     expect(currPost.senderId).toEqual(baseUser._id);
  //   });
  // });

  test("Test get posts by incorrect sender id", async () => {
    const response = await request(app).get(
      "/posts/sender=/6780eba5f7a9d4a880c56d6b/0/100"
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

      expect(currPost.description).toEqual(expectedPost.description);
      expect(currPost.restaurantName).toEqual(expectedPost.restaurantName);
      expect(currPost.rating).toEqual(expectedPost.rating);
      expect(currPost.googleApiRating).toEqual(expectedPost.googleApiRating);
    });
  });

  test("Get post by post id", async () => {
    const { body: currPost, statusCode } = await request(app).get(
      `/posts/${postId}`
    );
    const postContentToBe = testPostsArr[0];

    expect(statusCode).toEqual(200);
    expect(currPost.description).toEqual(postContentToBe.description);
    expect(currPost.restaurantName).toEqual(postContentToBe.restaurantName);
    expect(currPost.rating).toEqual(postContentToBe.rating);
    expect(currPost.googleApiRating).toEqual(postContentToBe.googleApiRating);
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
        restaurantName: "NEW TITLE",
        description: "NEW CONTENT",
      });

    expect(statusCode).toEqual(200);
    expect(updatedPost.restaurantName).toEqual("NEW TITLE");
    expect(updatedPost.description).toEqual("NEW CONTENT");
    expect(updatedPost._id).toEqual(postId);
  });

  test("Check updated Post", async () => {
    const { body: currPost, statusCode } = await request(app).get(
      `/posts/${postId}`
    );

    expect(statusCode).toEqual(200);
    expect(currPost.restaurantName).toEqual("NEW TITLE");
    expect(currPost.description).toEqual("NEW CONTENT");
    expect(currPost._id).toEqual(postId);
  });

  test("Test updating post without token", async () => {
    const response = await request(app).put(`/posts/${postId}`).send({
      restaurantName: "NEW TITLE 2",
      description: "NEW CONTENT 2",
    });

    expect(response.statusCode).toBe(401);
  });
});

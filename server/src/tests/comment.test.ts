import mongoose from "mongoose";
import commentModel, { Comment } from "../models/commentsModel";
import initApp from "../server";
import { Express } from "express";
import userModel, { User } from "../models/userModel";
import request from "supertest";

const testCommentsArr = [
  { message: "comment message 1", postId: "postId1" },
  { message: "comment message 2", postId: "postId1" },
  { message: "comment message 3", postId: "postId2" },
];

const USER_BASE_DETAILS = {
  name: "dan",
  username: "dan",
  password: "dan123",
  email: "dan@gmail.com",
};

let app: Express;
let baseUser: User & { token: string };
let commentId: string;

beforeAll(async () => {
  app = await initApp();

  await Promise.all([commentModel.deleteMany(), userModel.deleteMany()]);
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

describe("Test Comments API", () => {
  test("Get all comments before adding", async () => {
    const allComments = await request(app).get("/comments");

    expect(allComments.statusCode).toEqual(200);
    expect(allComments.body.length).toEqual(0);
  });

  test("Add single Comment", async () => {
    const testCommentToAdd = testCommentsArr[0];
    const singleComment = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + baseUser.token })
      .send(testCommentToAdd);

    expect(singleComment.statusCode).toEqual(201);
    expect(singleComment.body.message).toEqual(testCommentToAdd.message);
    expect(singleComment.body.postId).toEqual(testCommentToAdd.postId);
    expect(singleComment.body.senderId).toEqual(baseUser._id);

    commentId = singleComment.body._id;
  });
  test("Get all comments after add single comment", async () => {
    const allComments = await request(app).get("/comments");

    expect(allComments.statusCode).toEqual(200);
    expect(allComments.body.length).toEqual(1);

    expect(allComments.body[0].message).toEqual(testCommentsArr[0].message);
    expect(allComments.body[0].postId).toEqual(testCommentsArr[0].postId);
    expect(allComments.body[0].senderId).toEqual(baseUser._id);
  });

  test("Add Comments", async () => {
    const commentsLeftToAdd = testCommentsArr.filter((_, i) => i !== 0);

    for (const testCommentToAdd of commentsLeftToAdd) {
      const { statusCode, body: singleComment } = await request(app)
        .post("/comments")
        .set({ authorization: "JWT " + baseUser.token })
        .send(testCommentToAdd);

      expect(statusCode).toEqual(201);
      expect(singleComment.message).toEqual(testCommentToAdd.message);
      expect(singleComment.postId).toEqual(testCommentToAdd.postId);
      expect(singleComment.senderId).toEqual(baseUser._id);
    }
  });

  test("Test get comments by sender id", async () => {
    const response = await request(app).get(
      `/comments/${testCommentsArr[0].postId}`
    );

    expect(response.body.length).toEqual(2);
    expect(response.statusCode).toEqual(200);

    response.body.forEach((currComment: Comment, index: number) => {
      const expectedPost = testCommentsArr[index];

      expect(currComment.message).toEqual(expectedPost.message);
      expect(currComment.postId).toEqual(expectedPost.postId);
      expect(currComment.senderId).toEqual(baseUser._id);
    });
  });

  test("Test get comments by incorrect sender id", async () => {
    const response = await request(app).get(
      "/comments/6780eba5f7a9d4a880c56d6b"
    );

    expect(response.body.length).toBe(0);
    expect(response.statusCode).toEqual(200);
  });

  test("Test get all 3 comments", async () => {
    const allComments = await request(app).get("/comments");

    expect(allComments.body.length).toEqual(3);
    expect(allComments.statusCode).toEqual(200);

    allComments.body.forEach((currComment: Comment, index: number) => {
      const expectedPost = testCommentsArr[index];

      expect(currComment.message).toEqual(expectedPost.message);
      expect(currComment.postId).toEqual(expectedPost.postId);
      expect(currComment.senderId).toEqual(baseUser._id);
    });
  });

  test("Update comment", async () => {
    const { body: updatedComment, statusCode } = await request(app)
      .put(`/comments/${commentId}`)
      .set({ authorization: "JWT " + baseUser.token })
      .send({
        message: "NEW MESSAGE",
      });

    expect(statusCode).toEqual(200);
    expect(updatedComment.message).toEqual("NEW MESSAGE");
    expect(updatedComment._id).toEqual(commentId);
    expect(updatedComment.senderId).toEqual(baseUser._id);
  });

  test("Test updating post without token", async () => {
    const response = await request(app).put(`/posts/${commentId}`).send({
      messgae: "NEW MESSGAE 2",
    });

    expect(response.statusCode).toBe(401);
  });

  test("Test update comment with incorrect comment id", async () => {
    const response = await request(app)
      .put("/comments/67813c84b8f996b54a5e04ca")
      .set({ authorization: "JWT " + baseUser.token })
      .send({
        messgae: "NEW MESSGAE 2",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({});
  });

  test("Test delete comment", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set({
        authorization: "JWT " + baseUser.token,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("NEW MESSAGE");
    expect(response.body._id).toEqual(commentId);
    expect(response.body.senderId).toEqual(baseUser._id);
  });

  test("Test get all comment after delete comment", async () => {
    const allComments = await request(app).get("/comments");

    expect(allComments.body.length).toEqual(2);
    expect(allComments.statusCode).toEqual(200);
  });
});

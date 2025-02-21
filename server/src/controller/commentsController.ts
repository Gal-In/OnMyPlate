import { Request, Response } from "express";
import commentsModel from "../models/commentsModel";

const addNewComment = async (req: Request, res: Response) => {
  try {
    const { message, postId } = req.body;
    const newComment = await commentsModel.create({
      message,
      postId,
      senderId: req.params.userId,
    });
    res.status(201).send(newComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const allComments = await commentsModel.find({});
    res.status(200).send(allComments);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateComment = async (req: Request, res: Response) => {
  const CommentId = req.params.id;
  const newCommentData = req.body;

  try {
    const newComment = await commentsModel.findOneAndUpdate(
      { _id: CommentId },
      newCommentData,
      { new: true }
    );

    res.status(200).send(newComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await commentsModel.findByIdAndDelete(commentId);
    res.status(200).send(deletedComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  try {
    const PostComments = await commentsModel.find({ postId });
    res.status(200).send(PostComments);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  addNewComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentsByPostId,
};

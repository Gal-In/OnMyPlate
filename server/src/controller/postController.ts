import { Request, Response } from "express";
import postModel from "../models/postModel";

const addNewPost = async (req: Request, res: Response) => {
  try {
    const { description, restaurantName, rating, googleApiRating } = req.body;
    const newPost = await postModel.create({
      description,
      restaurantName,
      rating,
      googleApiRating,
      senderId: req.params.userId,
    });
    res.status(201).send(newPost);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await postModel.find({});
    res.status(200).send(allPosts);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const currentPost = await postModel.findById(postId);

    if (!currentPost) res.status(404).send("post not found");
    else res.status(200).send(currentPost);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPostsBySenderId = async (req: Request, res: Response) => {
  const senderId = req.params.senderId;

  try {
    const posts = await postModel.find({ senderId });
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const newPostData = req.body;

  try {
    const newPost = await postModel.findOneAndUpdate(
      { _id: postId },
      newPostData,
      { new: true }
    );

    res.status(200).send(newPost);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  addNewPost,
  getAllPosts,
  getPostById,
  getPostsBySenderId,
  updatePost,
};

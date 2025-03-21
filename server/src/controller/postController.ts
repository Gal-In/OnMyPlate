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

const getPosts = async (req: Request, res: Response) => {
  try {
    const { skip, limit } = req.params;

    const posts = await postModel
      .find({})
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).send(posts);
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
  const { skip, limit, senderId } = req.params;

  try {
    const posts = await postModel
      .find({ senderId })
      .skip(Number(skip))
      .limit(Number(limit));
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

const getAmountOfPosts = async (req: Request, res: Response) => {
  try {
    const postsNumber = await postModel.countDocuments();

    res.status(200).send({ amount: postsNumber });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  addNewPost,
  getPosts,
  getPostById,
  getPostsBySenderId,
  updatePost,
  getAmountOfPosts,
};

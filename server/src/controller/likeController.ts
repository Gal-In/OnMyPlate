import { Request, Response } from "express";
import likeModel from "../models/likeModel";

const addLike = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = req.params.userId;

  try {
    const isLikeExist = await likeModel.findOne({ postId, userId });

    if (isLikeExist) res.status(409).send("User cant like twice the same post");
    else {
      const like = await likeModel.create({
        userId,
        postId,
      });

      res.status(200).send(like);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const removeLike = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = req.params.userId;

  try {
    const like = await likeModel.findOneAndDelete({ postId, userId });

    res.status(200).send(like);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getAmountOfLikesOnPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const amount = await likeModel.countDocuments({ postId });

    res.status(200).send({ amount });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default { addLike, removeLike, getAmountOfLikesOnPost };

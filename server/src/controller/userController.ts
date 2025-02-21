import { Request, Response } from "express";
import userModel from "../models/userModel";
import authController from "../controller/authenticationController";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const currUser = await userModel.findById(req.params.id);

    if (currUser) {
      res.status(200).send(currUser);
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUserDetails = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const detailsToUpdate = req.body;

  if (detailsToUpdate.password)
    detailsToUpdate.password = await authController.encryptPassword(
      detailsToUpdate.password
    );

  try {
    const newUser = await userModel.findOneAndUpdate(
      { _id: userId },
      detailsToUpdate,
      { new: true }
    );

    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(400).send("invalid input");
      return;
    }
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserDetails,
  deleteUser,
};

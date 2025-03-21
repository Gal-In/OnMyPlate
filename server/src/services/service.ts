import { User } from "../models/userModel";
import { Document } from "mongoose";
import axios from "axios";

export const relevantUserInfo = (user: Document & User) => ({
  _id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  isGoogleUser: user.isGoogleUser,
  profilePictureExtension: user.profilePictureExtension,
});

export const urlToFile = async (url: string, fileName: string) => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(data, "binary");

  const file = new File([buffer], fileName + ".jpg", {
    type: "jpg",
    lastModified: new Date().getTime(),
  });

  return file;
};

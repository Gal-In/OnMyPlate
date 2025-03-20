import { Post } from "./postTypes";

export type DbUser = {
  _id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  profilePictureExtension?: string;
  likedPost?: Post[];
};

export type User = Omit<DbUser, "password"> & {
  isGoogleUser: boolean;
};

export type UserRequestResponse = User & {
  refreshToken: string;
  accessToken: string;
};

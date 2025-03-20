import { User } from "./userTypes";

export type Comment = {
    _id: string;
    message: string;
    postId: string;
    senderId: string;
  };
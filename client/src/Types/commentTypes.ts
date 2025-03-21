import { User } from "./userTypes";

export type Comment = {
    message: string;
    postId: string;
    senderId?: string;
    _id?: string;
  };
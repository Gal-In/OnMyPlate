import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Comment {
  _id: string;
  message: string;
  postId: string;
  senderId: string;
}

const commentsSchema = new Schema<Comment>({
  message: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
});

const commentsModel = mongoose.model("Comments", commentsSchema);

export default commentsModel;

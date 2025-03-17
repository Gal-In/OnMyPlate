import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Like {
  userId: string;
  postId: string;
}

const likeSchema = new Schema<Like>({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

const likeModel = mongoose.model("likes", likeSchema);

export default likeModel;

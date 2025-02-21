import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Post {
  _id: string;
  title: string;
  content?: string;
  senderId: string;
}

const postSchema = new Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  senderId: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;

import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Post {
  _id: string;
  restaurantName: string;
  description?: string;
  senderId: string;
  rating: number;
  googleApiRating: number;
}

const postSchema = new Schema<Post>({
  restaurantName: {
    type: String,
    required: true,
  },
  description: String,
  rating: {
    required: true,
    type: Number,
  },
  googleApiRating: {
    required: true,
    type: Number,
  },
  senderId: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;

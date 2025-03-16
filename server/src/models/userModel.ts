import mongoose from "mongoose";
const { Schema } = mongoose;

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  username?: string;
  email: string;
  password?: string;
  refreshTokens: string[];
  isGoogleUser: boolean;
  profilePictureExtension?: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  refreshTokens: {
    type: [String],
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
    required: true,
  },
  profilePictureExtension: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;

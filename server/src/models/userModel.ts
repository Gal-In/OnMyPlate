import mongoose from "mongoose";
const { Schema } = mongoose;

export interface User {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  refreshTokens: string[];
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
  },
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;

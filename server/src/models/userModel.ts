import mongoose from "mongoose";
const { Schema } = mongoose;

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  refreshTokens: string[];
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
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

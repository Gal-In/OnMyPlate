import axios from "axios";
import { DbUser, User, UserRequestResponse } from "../Types/userTypes";
import { Post } from "../Types/postTypes";
import { Comment } from "../Types/commentTypes";
import { Like } from "../Types/likeTypes";

export type GoogleMapApiRes = {
  formatted_address: string;
  name: string;
  place_id: string;
  rating: number;
};

const saveNewUser = async (newUser: DbUser) => {
  try {
    const { data } = await axios.post<UserRequestResponse>(
      process.env.REACT_APP_SERVER_URL + "/auth/registration",
      newUser
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
};

const uploadUserProfilePicture = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/file/profilePicture",
      formData
    );

    return data;
  } catch (error) {
    return error;
  }
};

const addGoogleUser = async (userToken: string) => {
  try {
    const { data } = await axios.post<UserRequestResponse>(
      process.env.REACT_APP_SERVER_URL + "/auth/googleRegistration",
      { userToken }
    );

    return data;
  } catch (error) {
    return error;
  }
};

const verifyUser = async (username: string, password: string) => {
  try {
    const { data } = await axios.post<UserRequestResponse>(
      process.env.REACT_APP_SERVER_URL + "/auth/login",
      { username, password }
    );

    return data;
  } catch (error) {
    return error;
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await axios.post<UserRequestResponse>(
      process.env.REACT_APP_SERVER_URL + "/auth/refreshToken",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return error;
  }
};

const logoutUser = async (refreshToken: string) => {
  try {
    const { data } = await axios.post<UserRequestResponse>(
      process.env.REACT_APP_SERVER_URL + "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return error;
  }
};

const uploadPostPictures = async (postId: string, files: File[]) => {
  try {
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));
    const { data } = await axios.post(
      process.env.REACT_APP_SERVER_URL + `/file/postPictures/${postId}`,
      formData
    );

    return data;
  } catch (error) {
    return error;
  }
};

const findRestaurantByName = async ({
  inputType = "textquery",
  language = "iw",
  fields = "formatted_address%2Cname%2Crating%2Cplace_id",
  input = "",
}: {
  inputType?: string;
  language?: string;
  fields?: string;
  input: string;
}) => {
  try {
    const response = await axios.post<GoogleMapApiRes[]>(
      process.env.REACT_APP_SERVER_URL + `/googleApi/restaurantApi`,
      { input, inputType, fields, language }
    );

    return response.data;
  } catch (e) {
    return e;
  }
};

const generatePostDescription = async (
  restaurantName: string,
  images: string[]
): Promise<{ description: string } | unknown> => {
  try {
    const { data } = await axios.post<{ description: string }>(
      process.env.REACT_APP_SERVER_URL + `/googleApi/generateDescription`,
      { images, restaurantName }
    );

    return data;
  } catch (error) {
    return error;
  }
};

const getPostCount = async () => {
  try {
    const { data } = await axios.get<{ amount: string }>(
      process.env.REACT_APP_SERVER_URL + "/posts/amount"
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
};

const getPagedPosts = async (skip: number, limit: number): Promise<Post[]> => {
  try {
    const { data } = await axios.get<Post[]>(
      process.env.REACT_APP_SERVER_URL + `/posts/${skip}/${limit}`
    );

    return data;
  } catch (error: unknown) {
    return [];
  }
};

const getPostById = async (id: string) => {
  try {
    const { data } = await axios.get<Post>(
      process.env.REACT_APP_SERVER_URL + `/posts/${id}`
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
};

const getCommentsById = async (postId: string) => {
  try {
    const { data } = await axios.get<Comment[]>(
      process.env.REACT_APP_SERVER_URL + `/comments/${postId}`
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
}

const getUserById = async (senderId: string) => {
  try {
    const { data } = await axios.get<User>(
      process.env.REACT_APP_SERVER_URL + `/users/${senderId}`
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
}

const getLikeAmount = async (postId: string) => {
  try {
    const { data } = await axios.get<{amount: number}>(
      process.env.REACT_APP_SERVER_URL + `/like/${postId}`
    );

    return data.amount;
  } catch (error: unknown) {
    return error;
  }
}

const getCommentsAmount = async (postId: string) => {
  try {
    const { data } = await axios.get<{amount: number}>(
      process.env.REACT_APP_SERVER_URL + `/comments/${postId}`
    );

    return data.amount;
  } catch (error: unknown) {
    return error;
  }
}

export {
  saveNewUser,
  verifyUser,
  uploadUserProfilePicture,
  addGoogleUser,
  refreshAccessToken,
  logoutUser,
  uploadPostPictures,
  findRestaurantByName,
  generatePostDescription,
  getPostCount,
  getPagedPosts,
  getPostById,
  getCommentsById,
  getUserById,
  getLikeAmount,
};

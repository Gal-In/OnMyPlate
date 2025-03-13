import axios from "axios";
import { DbUser, UserRequestResponse } from "../Types/userTypes";

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
      process.env.REACT_APP_SERVER_URL + `/googleApi`,
      { input, inputType, fields, language }
    );

    return response.data;
  } catch (e) {
    return e;
  }
};

const chatGptApi = async (restaurantName: string) => {
  try {
    const response = await axios.post<GoogleMapApiRes[]>(
      process.env.REACT_APP_SERVER_URL + `/googleApi/chatGpt`,
      restaurantName
    );

    return response.data;
  } catch (e) {
    return e;
  }
};

export {
  saveNewUser,
  verifyUser,
  uploadUserProfilePicture,
  addGoogleUser,
  refreshAccessToken,
  logoutUser,
  uploadPostPictures,
  findRestaurantByName,
  chatGptApi,
};

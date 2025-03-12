import axios from "axios";
import { DbUser, UserRequestResponse } from "../Types/userTypes";

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

export {
  saveNewUser,
  verifyUser,
  uploadUserProfilePicture,
  addGoogleUser,
  refreshAccessToken,
  logoutUser,
};

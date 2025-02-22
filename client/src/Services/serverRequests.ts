import axios from "axios";
import User from "../Types/userTypes";

const saveNewUser = async (newUser: User) => {
  try {
    const { data } = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/auth/registration",
      newUser
    );

    return data;
  } catch (error) {
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

const verifyUser = () => {};

export { saveNewUser, verifyUser, uploadUserProfilePicture };

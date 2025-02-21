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

const verifyUser = () => {};

export { saveNewUser, verifyUser };

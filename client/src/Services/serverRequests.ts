import axios from "axios";
import User from "../Types/userTypes";

const saveNewUser = async (newUser: User) => {
  const { data } = await axios.post(
    process.env.REACT_APP_SERVER_URL + "/auth/registration",
    newUser
  );

  console.log(data);
};

const verifyUser = () => {};

export { saveNewUser, verifyUser };

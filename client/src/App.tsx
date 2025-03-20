import { SetStateAction, useEffect } from "react";
import "./App.css";
import SignUpPage from "./Components/SignPage/SignUpPage";
import { UserContext, useUser } from "./Context/useUser";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from "./Components/MainPage";
import { useCookies } from "react-cookie";
import { refreshAccessToken } from "./Services/serverRequests";
import axios from "axios";
import { UserRequestResponse } from "./Types/userTypes";
import Switch from "@mui/material/Switch";
import PostPage from "./Components/PostPage/PostPage";
import SignInPgae from "./Components/SignPage/SignInPage";
import SignInPage from "./Components/SignPage/SignInPage";

const App = () => {
  const { user, setUser, setAccessToken } = useUser();
  const [cookie, setCookie] = useCookies(["refreshToken"]);

  useEffect(() => {
    const initUser = async () => {
      const { refreshToken } = cookie;

      if (refreshToken?.length) {
        const response = await refreshAccessToken(refreshToken);
        if (!axios.isAxiosError(response)) {
          const { accessToken, refreshToken, ...userDetails } =
            response as UserRequestResponse;
          setAccessToken(accessToken);
          setCookie("refreshToken", refreshToken);
          setUser(userDetails);
        }
      }
    };

    initUser();
  }, []);


  return (
      <Router>
        <Routes>
          <Route path="/restaurant/:id" element={<PostPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<SignInPage />} />
        </Routes>
      </Router>
  );
  // <div className="App">{user ? <MainPage /> : <SignUpPage />}</div>;
};

export default App;

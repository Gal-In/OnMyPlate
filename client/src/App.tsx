import { useEffect } from "react";
import "./App.css";
import SignUpPage from "./Components/SignPage/SignUpPage";
import { useUser } from "./Context/useUser";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import MainPage from "./Components/MainPage";
import { useCookies } from "react-cookie";
import { refreshAccessToken } from "./Services/serverRequests";
import axios from "axios";
import { UserRequestResponse } from "./Types/userTypes";
import PostPage from "./Components/PostPage/PostPage";
import SignInPage from "./Components/SignPage/SignInPage";

const App = () => {
  const { user, setUser, setAccessToken } = useUser();
  const [cookie, setCookie] = useCookies(["refreshToken"]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initUser = async () => {
      let isUserAuthorized = false;
      const pathName = location.pathname.toLocaleLowerCase();
      const { refreshToken } = cookie;

      if (refreshToken?.length) {
        const response = await refreshAccessToken(refreshToken);
        if (!axios.isAxiosError(response)) {
          const { accessToken, refreshToken, ...userDetails } =
            response as UserRequestResponse;
          setAccessToken(accessToken);
          setCookie("refreshToken", refreshToken);
          setUser(userDetails);

          isUserAuthorized = true;
        }
      }

      if (
        isUserAuthorized &&
        (pathName === "/signin" || pathName === "/signup" || pathName === "/")
      )
        navigate("/main");

      if (
        !isUserAuthorized &&
        pathName !== "/signin" &&
        pathName !== "/signup"
      ) {
        navigate("/signIn");
      }
    };

    initUser();
  }, []);

  return (
    <Routes>
      <Route path="/restaurant/edit/:id" element={<PostPage />} />
      <Route path="/restaurant/:id" element={<PostPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/" element={<SignInPage />} />
    </Routes>
  );
};

export default App;

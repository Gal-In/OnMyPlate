import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useUser } from "./useUser";
import { useCookies } from "react-cookie";
import AxiosManager from "../Services/authAxios";
import { useLocation, useNavigate } from "react-router-dom";

type AuthApiContextProviderProps = {
  children: React.ReactNode;
};

const AuthApiContext = createContext<AxiosManager | null>(null);

export const AuthApiContextProvider = ({
  children,
}: AuthApiContextProviderProps) => {
  const { accessToken, setAccessToken } = useUser();
  const [{ refreshToken }, setCookie, removeCookie] = useCookies([
    "refreshToken",
  ]);
  const { setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const authAxiosInstance = useMemo(() => {
    return new AxiosManager(
      accessToken,
      refreshToken,
      setAccessToken,
      (newRefreshToken: string | null) => {
        if (newRefreshToken)
          setCookie("refreshToken", newRefreshToken, { path: "/" });
        else removeCookie("refreshToken");
      }
    );
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const pathName = location.pathname.toLocaleLowerCase();

      if (authAxiosInstance) {
        const user = await authAxiosInstance.initToken();

        if (user) {
          if (
            pathName === "/signin" ||
            pathName === "/signup" ||
            pathName === "/"
          )
            navigate("/main");

          setUser(user);
        } else {
          removeCookie("refreshToken");
          if (pathName !== "/signin" && pathName !== "/signup") {
            navigate("/signIn");
          }
        }
      }
    };

    initUser();
  }, [authAxiosInstance]);

  return (
    <AuthApiContext.Provider value={authAxiosInstance}>
      {children}
    </AuthApiContext.Provider>
  );
};

export const useAuthApi = () => {
  const context = useContext(AuthApiContext);

  if (!context) {
    throw new Error("");
  }

  return context;
};

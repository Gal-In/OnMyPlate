import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "./useUser";
import getAuthorizedAxios from "../Services/authAxios";
import { useCookies } from "react-cookie";
import { AxiosInstance } from "axios";

type AuthApiContextProviderProps = {
  children: React.ReactNode;
};

const AuthApiContext = createContext<AxiosInstance | null>(null);

export const AuthApiContextProvider = ({
  children,
}: AuthApiContextProviderProps) => {
  const { accessToken, setAccessToken } = useUser();
  const [{ refreshToken }, setCookie] = useCookies(["refreshToken"]);

  const authAxiosInstance = useMemo(
    () =>
      getAuthorizedAxios(
        accessToken,
        setAccessToken,
        refreshToken,
        (newRefreshToken: string) => setCookie("refreshToken", newRefreshToken)
      ),
    [accessToken, refreshToken, setAccessToken, setCookie]
  );

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

import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "./useUser";
import { useCookies } from "react-cookie";
import AxiosManager from "../Services/authAxios";

type AuthApiContextProviderProps = {
  children: React.ReactNode;
};

const AuthApiContext = createContext<AxiosManager | null>(null);

export const AuthApiContextProvider = ({
  children,
}: AuthApiContextProviderProps) => {
  const { accessToken, setAccessToken } = useUser();
  const [{ refreshToken }, setCookie] = useCookies(["refreshToken"]);

  const authAxiosInstance = useMemo(
    () =>
      new AxiosManager(
        accessToken,
        refreshToken,
        setAccessToken,
        (newRefreshToken: string) => setCookie("refreshToken", newRefreshToken)
      ),
    [accessToken, refreshToken]
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

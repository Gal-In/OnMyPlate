import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./serverRequests";
import { UserRequestResponse } from "../Types/userTypes";

type CustomAxiosConfig = InternalAxiosRequestConfig & {
  isNotFirstRequest?: boolean;
};

const authorizedAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const getAuthorizedAxios = (
  accessToken: string | null,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
  refreshToken: string,
  setRefreshToken: (newRefreshToken: string) => void
) => {
  authorizedAxios.interceptors.request.use((requestConfig) => {
    if (accessToken?.length)
      requestConfig.headers["Authorization"] = `Bearer ${accessToken}`;

    return requestConfig;
  });

  authorizedAxios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as CustomAxiosConfig;
      if (
        (error.status === 403 || error.status === 401) &&
        !config.isNotFirstRequest
      ) {
        config.isNotFirstRequest = true;

        const response = await refreshAccessToken(refreshToken);

        if (response && !axios.isAxiosError(response)) {
          const { accessToken, refreshToken } = response as UserRequestResponse;

          config.headers["Authorization"] = `Bearer ${accessToken}`;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          return authorizedAxios;
        }
      }

      return Promise.reject(error);
    }
  );

  return authorizedAxios;
};

export default getAuthorizedAxios;

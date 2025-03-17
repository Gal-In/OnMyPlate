import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./serverRequests";
import { UserRequestResponse } from "../Types/userTypes";

type CustomAxiosConfig = InternalAxiosRequestConfig & {
  isNotFirstRequest?: boolean;
};

class AxiosManager {
  private accessToken: string | null;
  private refreshToken: string;
  private setAccessToken;
  private setRefreshToken;

  constructor(
    accessToken: string | null,
    refreshToken: string,
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
    setRefreshToken: (newToken: string) => void
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.setAccessToken = setAccessToken;
    this.setRefreshToken = setRefreshToken;
  }

  getAuthorizedAxios = () => {
    const authorizedAxios = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
    });

    authorizedAxios.interceptors.request.use((requestConfig) => {
      if (this.accessToken?.length)
        requestConfig.headers["Authorization"] = `Bearer ${this.accessToken}`;

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
          const response = await refreshAccessToken(this.refreshToken);

          if (response && !axios.isAxiosError(response)) {
            const tokens = response as UserRequestResponse;

            config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
            this.accessToken = tokens.accessToken;
            this.refreshToken = tokens.refreshToken;
            this.setAccessToken(tokens.accessToken);
            this.setRefreshToken(tokens.refreshToken);

            return await axios(config);
          }
        }

        return Promise.reject(error);
      }
    );

    return authorizedAxios;
  };
}

export default AxiosManager;

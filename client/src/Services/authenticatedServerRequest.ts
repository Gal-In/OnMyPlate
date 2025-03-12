import { useAuthApi } from "../Context/useAuthApi";

export const useAuthenticatedServerRequest = () => {
  const axios = useAuthApi();

  const someFuncation = () => {
    console.log("some function");
  };

  return { someFuncation };
};

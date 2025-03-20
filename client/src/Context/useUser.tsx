import React, { createContext, useContext, useState } from "react";
import { User } from "../Types/userTypes";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
};

type UserContextProviderProps = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within an provider");
  }

  return context;
};

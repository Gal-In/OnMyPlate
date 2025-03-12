export type DbUser = {
  name: string;
  username: string;
  password: string;
  email: string;
  profilePictureExtension?: string;
};

export type User = Omit<DbUser, "password"> & {
  isGoogleUser: boolean;
};

export type UserRequestResponse = User & {
  refreshToken: string;
  accessToken: string;
};

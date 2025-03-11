export type DbUser = {
  name: string;
  username: string;
  password: string;
  email: string;
  profilePictureExtension?: string;
};

export type User = {
  name: string;
  username: string;
  email: string;
  isGoogleUser: boolean;
  profilePictureExtension?: string;
};

export type UserRequestResponse = {
  email: string;
  isGoogleUser: boolean;
  name: string;
  password: string;
  refreshToken: string;
  username: string;
  profilePictureExtension?: string;
};

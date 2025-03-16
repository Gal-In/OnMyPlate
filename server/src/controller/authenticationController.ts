import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel, { User } from "../models/userModel";
import { Types } from "mongoose";
import axios from "axios";
import { GoogleUserResponse } from "../types";
import { relevantUserInfo, urlToFile } from "../services/service";

const setUserRefreshTokens = async (
  userId: Types.ObjectId,
  refreshTokens: string[] = []
) => {
  await userModel.findOneAndUpdate({ _id: userId }, { refreshTokens });
};

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(password, salt);
};

const generateTokens = (user: User) => {
  const userId = user._id.toString();

  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET as string
  );

  return { refreshToken, accessToken };
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) res.status(403).send(err);
        else {
          req.params.userId = (user as JwtPayload).id;
          next();
        }
      }
    );
  } else res.status(401).send("unauthorized - token not found");
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const currUser = await userModel.findOne({ username });
  if (currUser) {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      currUser.password!
    );

    if (isPasswordCorrect) {
      const tokens = generateTokens(currUser);

      const newTokens = currUser.refreshTokens ?? [];
      newTokens.push(tokens.refreshToken);

      await setUserRefreshTokens(currUser._id, newTokens);

      res.status(200).send({
        ...tokens,
        ...relevantUserInfo(currUser),
      });
      return;
    }
  }

  res.status(400).send("user details are incorrect");
};

const logout = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (error, userPayload) => {
        if (error) {
          res.status(403).send(error);
        } else {
          try {
            const user: User | null = await userModel.findById(
              (userPayload as JwtPayload).id
            );

            if (!user) {
              res.status(403).send("invalid request");
              return;
            }

            const isTokenValid = user.refreshTokens.includes(token);

            if (isTokenValid) {
              const refreshTokens = user.refreshTokens.filter(
                (currToken) => currToken != token
              );
              await setUserRefreshTokens(user._id, refreshTokens);
              res.status(200).send();
            } else {
              await setUserRefreshTokens(user._id);
              res.status(403).send("invalid request");
            }
          } catch (err) {
            res.status(403).send(err);
          }
        }
      }
    );
  } else {
    res.status(401).send("unauthorized - token not found");
  }
};

const registration = async (req: Request, res: Response) => {
  const { username, email, password, name, profilePictureExtension } = req.body;

  if (
    !username?.length ||
    !email?.length ||
    !password?.length ||
    !name?.length
  ) {
    res.status(400).send("user details are missing");
    return;
  }

  try {
    const user = await userModel.findOne({ $or: [{ username }, { email }] });

    if (user) {
      const field = user.username === username ? "username" : "email";
      res.status(409).send(`user already exist - ${field}`);
      return;
    }

    const encryptedPassword = await encryptPassword(password);
    const newUser = await userModel.create({
      name,
      username,
      email,
      password: encryptedPassword,
      profilePictureExtension,
    });

    const tokens = generateTokens(newUser);

    res.status(201).send({ ...relevantUserInfo(newUser), ...tokens });
  } catch (error) {
    res.status(400).send(error);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err, userPayload) => {
        if (err) res.status(403).send(err);
        else {
          const user = await userModel.findById((userPayload as JwtPayload).id);

          if (!user) {
            res.status(403).send("invalid request");
            return;
          }

          if (!user.refreshTokens.includes(token)) {
            await setUserRefreshTokens(user._id);
            res.status(403).send("invalid request");
            return;
          }

          const { accessToken, refreshToken } = generateTokens(user);
          const newRefreshTokens = user.refreshTokens;
          newRefreshTokens[newRefreshTokens.indexOf(token)] = refreshToken;
          await setUserRefreshTokens(user._id, newRefreshTokens);

          res
            .status(200)
            .send({ accessToken, refreshToken, ...relevantUserInfo(user) });
        }
      }
    );
  } else res.status(401).send("unauthorized - token not found");
};

const verifyGoogleUser = async (
  userToken: String
): Promise<GoogleUserResponse> => {
  const { data } = await axios.post<GoogleUserResponse>(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${userToken}`
  );

  return data;
};

const googleRegistration = async (req: Request, res: Response) => {
  const { userToken }: { userToken: string } = req.body;

  if (userToken) {
    const data = await verifyGoogleUser(userToken);

    const { name, email, picture } = data;

    const user = await userModel.findOne({ email });
    if (user) {
      res.status(409).send("user already exist");
      return;
    }

    const file = await urlToFile(picture, email);

    const newUserInfo = {
      name,
      email,
      isGoogleUser: true,
      profilePictureExtension: file.type,
    };

    const newUser = await userModel.create(newUserInfo);

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `http:localhost:${process.env.PORT}/file/profilePicture`,
      formData
    );

    const tokens = generateTokens(newUser);

    res.status(201).send({ ...newUserInfo, ...tokens });
  } else {
    res.status(400).send("user google token not found");
  }
};

export default {
  authenticate,
  login,
  logout,
  registration,
  refreshToken,
  encryptPassword,
  googleRegistration,
};

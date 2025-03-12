import React, { useState } from "react";
import SignPageWrapper from "./SignPageWrapper";
import {
  Avatar,
  FormControl,
  TextField,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useUser } from "../../Context/useUser";
import { verifyUser } from "../../Services/serverRequests";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserRequestResponse } from "../../Types/userTypes";

type SignInPageProps = {
  onSwitchPage: () => void;
  requestErrorMessage: string;
  setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const SignInPgae = ({
  onSwitchPage,
  requestErrorMessage,
  setRequestErrorMessage,
}: SignInPageProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fieldsError, setFieldsError] = useState<Record<string, string>>({});

  const [_, setCookie] = useCookies(["refreshToken"]);
  const { setUser, setAccessToken } = useUser();

  const handleSubmit = async () => {
    if (!validateInputs()) {
      const response = await verifyUser(username, password);

      if (axios.isAxiosError(response)) {
        setRequestErrorMessage("המשתמש לא נמצא");
      }

      const userInfo = response as UserRequestResponse;

      setCookie("refreshToken", userInfo.refreshToken);
      setUser({
        username,
        email: userInfo.email,
        isGoogleUser: userInfo.isGoogleUser,
        name: userInfo.name,
        profilePictureExtension: userInfo.profilePictureExtension,
      });
      setAccessToken(userInfo.accessToken);
    }
  };

  const validateInputs = () => {
    const errorObject: Record<string, string> = {};

    if (!username.length) errorObject.username = "חייב למלא שם משתמש";

    if (!password.length) errorObject.password = "חייב למלא סיסמה";

    setFieldsError(errorObject);

    return !!Object.keys(errorObject).length;
  };

  return (
    <>
      <SignPageWrapper
        title="מסך כניסה"
        requestErrorMessage={requestErrorMessage}
        setRequestErrorMessage={setRequestErrorMessage}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 100,
              height: 100,
            }}
          >
            <Avatar
              src={"/projectLogo.svg"}
              alt="Profile"
              sx={{
                height: 100,
                width: 100,
                backgroundColor: "transparent",
                "& img": { objectFit: "contain" },
              }}
            />
          </div>
        </div>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl
            sx={{
              gap: 2,
            }}
          >
            <TextField
              error={!!fieldsError.username}
              helperText={fieldsError.username ?? ""}
              id="username"
              autoFocus
              fullWidth
              variant="outlined"
              color={fieldsError.username ? "error" : "primary"}
              label="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 15 } }}
            />
            <TextField
              error={!!fieldsError.password}
              helperText={fieldsError.password ?? ""}
              name="password"
              type="password"
              id="password"
              autoFocus
              fullWidth
              variant="outlined"
              color={fieldsError.password ? "error" : "primary"}
              label="סיסמה"
              slotProps={{ htmlInput: { maxLength: 20 } }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            כניסה
          </Button>
        </Box>
        <Divider>אופציות נוספות</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>עדיין לא רשום?</Typography>
          <Button
            sx={{ textAlign: "center" }}
            variant="outlined"
            onClick={onSwitchPage}
          >
            הרשמה
          </Button>
        </Box>
      </SignPageWrapper>
    </>
  );
};

export default SignInPgae;

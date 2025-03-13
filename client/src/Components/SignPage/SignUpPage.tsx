import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  addGoogleUser,
  saveNewUser,
  uploadUserProfilePicture,
} from "../../Services/serverRequests";
import axios from "axios";
import dataUrlToFile from "../../Services/fileConvertorService";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../Context/useUser";
import SignPageWrapper from "../CardWrapper";
import SignInPgae from "./SignInPage";
import { User, UserRequestResponse } from "../../Types/userTypes";
import { Close, Edit } from "@mui/icons-material";

type SignUpPageProps = {
  user?: User | null;
  onFinish?: () => void;
};

const SignUpPage = ({ user, onFinish }: SignUpPageProps) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [password, setPassword] = useState<string>(user ? "******" : "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [fieldsError, setFieldsError] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [requestErrorMessage, setRequestErrorMessage] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const { setUser, setAccessToken } = useUser();

  const googleLogin = useGoogleLogin({
    onSuccess: (credentials) => handleGoogleLogin(credentials.access_token),
  });

  const isAbleToEdit = useMemo(() => !user || isEditMode, [user, isEditMode]);

  const handleGoogleLogin = async (googleAcessToken: string) => {
    const response = await addGoogleUser(googleAcessToken);

    if (axios.isAxiosError(response)) {
      setRequestErrorMessage(`שים לב, חשבון גוגל זה כבר קיים`);
    } else {
      const userInfo = response as UserRequestResponse;
      setUser({
        username: userInfo.username,
        email: userInfo.email,
        name: userInfo.name,
        isGoogleUser: userInfo.isGoogleUser,
        profilePictureExtension: userInfo.profilePictureExtension,
      });
      setAccessToken(userInfo.accessToken);
    }
  };

  const handleSubmit = async () => {
    let imageFile = null;

    if (!validateInputs()) {
      if (imageUrl) imageFile = await dataUrlToFile(imageUrl, email);

      const profilePictureExtension = imageFile?.type;

      const response = await saveNewUser({
        username,
        email,
        password,
        name,
        profilePictureExtension,
      });
      if (axios.isAxiosError(response)) {
        if (response.status === 409) {
          const field = response.response?.data.includes("email")
            ? "האימייל"
            : "שם המשתמש";
          setRequestErrorMessage(`שים לב, ${field} כבר קיים`);
        } else setRequestErrorMessage("קיימת תקלה בשרת, המשתמש לא נשמר");
      } else {
        if (imageFile) {
          try {
            await uploadUserProfilePicture(imageFile);
          } catch (e) {
            setRequestErrorMessage("קיימת תקלה בשרת, תמונת הפרופיל לא נשמרה");
            return;
          }
        }

        const userInfo = response as UserRequestResponse;

        setUser({
          username,
          email,
          name,
          isGoogleUser: userInfo.isGoogleUser,
          profilePictureExtension: userInfo.profilePictureExtension,
        });

        setAccessToken(userInfo.accessToken);
      }
    }
  };

  const validateInputs = () => {
    const errorObject: Record<string, string> = {};

    if (!/^[A-Za-zא-ת]{2,}$/.test(name))
      errorObject.name = "שם חייב להכיל 2 אותיות לפחות, ללא מספרים";

    if (!/^\S{3,}$/.test(username))
      errorObject.username = "שם משתמש חייב להכיל לפחות 3 אותיות ללא רווחים";

    if (!/^(?!.*\s).{2,}@gmail\.com$/.test(email))
      errorObject.email = "נא הזן כתובת מייל תקינה";

    if (!/^\S{6,}$/.test(password))
      errorObject.password = "סיסמה חייבת להכיל לפחות 6 תווים ללא רווחים";

    setFieldsError(errorObject);

    return !!Object.keys(errorObject).length;
  };

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const file = target.files?.[0];

    if (!file) return;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      if (e.target?.result) setImageUrl(e.target?.result as string);
    };
  };

  return isSignUp ? (
    <SignPageWrapper
      title={user ? "ערוך פרופיל" : "מסך הרשמה"}
      errorMessage={requestErrorMessage}
      setErrorMessage={setRequestErrorMessage}
    >
      <IconButton
        sx={{
          position: "absolute",
        }}
        onClick={() => onFinish && onFinish()}
      >
        <Close />
      </IconButton>

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
            src={imageUrl ?? "/projectLogo.svg"}
            alt="Profile"
            sx={{
              height: 100,
              width: 100,
              backgroundColor: "transparent",
              "& img": { objectFit: "contain" },
            }}
          />
          <input
            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
            id="add-file"
            onChange={handleCapture}
            type="file"
            hidden
          />
          <label htmlFor="add-file">
            <Tooltip title="החלף תמונת פרופיל">
              <IconButton
                disabled={!isAbleToEdit}
                component="span"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  left: -10,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <SwapHorizIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </label>
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
            gap: 1.5,
          }}
        >
          <TextField
            error={!!fieldsError.name}
            helperText={fieldsError.name ?? ""}
            id="name"
            autoFocus
            fullWidth
            variant="outlined"
            color={fieldsError.name ? "error" : "primary"}
            label="שם"
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            disabled={!isAbleToEdit}
          />
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
            disabled={!isAbleToEdit}
          />
          <TextField
            error={!!fieldsError.email}
            helperText={fieldsError.email ?? ""}
            id="email"
            type="email"
            autoFocus
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            color={fieldsError.email ? "error" : "primary"}
            label="אימייל"
            slotProps={{ htmlInput: { maxLength: 25 } }}
            disabled={!!user}
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
            disabled={!!user}
          />
        </FormControl>
        {!user && (
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            הרשמה
          </Button>
        )}
      </Box>
      {!user ? (
        <>
          <Divider>אופציות נוספות</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => googleLogin()}
              startIcon={
                <Avatar
                  src={"/googleLogo.png"}
                  sx={{
                    maxWidth: "2rem",
                    maxHeight: "2rem",
                    objectFit: "contain",
                    paddingRight: 1,
                  }}
                />
              }
            >
              הירשם באמצעות גוגל
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              יש לך כבר משתמש?
            </Typography>
            <Button
              sx={{ textAlign: "center" }}
              variant="outlined"
              onClick={() => setIsSignUp(false)}
            >
              כניסה למערכת
            </Button>
          </Box>
        </>
      ) : (
        <>
          {isEditMode ? (
            <Button
              variant="outlined"
              sx={{ width: "fitContent", alignSelf: "center" }}
              onClick={() => {}}
            >
              {"עדכן פרופיל"}
            </Button>
          ) : (
            <Button
              endIcon={<Edit />}
              variant="outlined"
              sx={{ width: "fitContent", alignSelf: "center" }}
              onClick={() => setIsEditMode(true)}
            >
              {"ערוך פרופיל"}
            </Button>
          )}
        </>
      )}
    </SignPageWrapper>
  ) : (
    <SignInPgae
      requestErrorMessage={requestErrorMessage}
      setRequestErrorMessage={setRequestErrorMessage}
      onSwitchPage={() => setIsSignUp(true)}
    />
  );
};

export default SignUpPage;

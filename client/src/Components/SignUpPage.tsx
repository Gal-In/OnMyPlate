import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  saveNewUser,
  uploadUserProfilePicture,
} from "../Services/serverRequests";
import axios from "axios";
import dataUrlToFile from "../Services/fileConvertorService";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  maxWidth: "400px",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignUpPage = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fieldsError, setFieldsError] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [requestErrorMessage, setRequestErrorMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (!validateInputs()) {
      const response = await saveNewUser({ username, email, password, name });

      if (axios.isAxiosError(response)) {
        if (response.status === 409)
          setRequestErrorMessage("שים לב, שם המשתמש כבר קיים");
        else setRequestErrorMessage("קיימת תקלה בשרת, המשתמש לא נשמר");
      } else {
        if (imageUrl) {
          const file = await dataUrlToFile(imageUrl, username);

          try {
            await uploadUserProfilePicture(file);
          } catch (e) {
            setRequestErrorMessage("קיימת תקלה בשרת, תמונת הפרופיל לא נשמרה");
          }
        }
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

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      dir="rtl"
      sx={{
        height: "100%",
        padding: 5,
      }}
    >
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: "100%" }}>
          הרשמה
        </Typography>
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
              gap: 2,
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
            הרשמה
          </Button>
        </Box>
        <Divider>אופציות נוספות</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("חחחח עוד לא קיים")}
          >
            הירשם עם גוגל
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            יש לך כבר משתמש?
            <Link
              // href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              כניסה למערכת
            </Link>
          </Typography>
        </Box>
      </Card>

      <Snackbar
        open={!!requestErrorMessage.length}
        autoHideDuration={3000}
        onClose={() => setRequestErrorMessage("")}
        message={requestErrorMessage}
      >
        <Alert
          onClose={() => setRequestErrorMessage("")}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {requestErrorMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignUpPage;

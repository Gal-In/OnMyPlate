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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

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
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fieldsError, setFieldsError] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TOOD: send new user to the server, get back tokens
  };

  const validateInputs = () => {
    const errorObject: Record<string, string> = {};

    if (!/^[A-Za-zא-ת]{2,}$/.test(name))
      errorObject.name = "שם חייב להכיל 2 אותיות לפחות, ללא מספרים";

    if (!/^\S{6,}$/.test(userName))
      errorObject.userName = "שם משתמש חייב להכיל לפחות 6 אותיות ללא רווחים";

    if (!/^(?!.*\s).{2,}@gmail\.com$/.test(email))
      errorObject.email = "נא הזן כתובת מייל תקינה";

    if (!/^\S{6,}$/.test(password))
      errorObject.password = "סיסמה חייבת להכיל לפחות 6 תווים ללא רווחים";

    setFieldsError(errorObject);
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
              src="/projectLogo.svg"
              alt="Profile"
              sx={{
                height: 100,
                width: 100,
                backgroundColor: "transparent",
                "& img": { objectFit: "contain" },
              }}
            />

            <IconButton
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
          </div>
        </div>

        <Box
          component="form"
          onSubmit={handleSubmit}
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
              error={!!fieldsError.userName}
              helperText={fieldsError.userName ?? ""}
              id="userName"
              autoFocus
              fullWidth
              variant="outlined"
              color={fieldsError.userName ? "error" : "primary"}
              label="שם משתמש"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
          <Button fullWidth variant="contained" onClick={validateInputs}>
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
    </Stack>
  );
};

export default SignUpPage;

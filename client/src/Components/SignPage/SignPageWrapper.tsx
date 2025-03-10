import {
  Typography,
  Stack,
  Card as MuiCard,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

type SignPageProps = {
  title: string;
  requestErrorMessage: string;
  setRequestErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  children?: React.ReactNode;
};

const SignPageWrapper = ({
  title,
  requestErrorMessage,
  setRequestErrorMessage,
  children,
}: SignPageProps) => {
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
          {title}
        </Typography>
        {children}
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

export default SignPageWrapper;
